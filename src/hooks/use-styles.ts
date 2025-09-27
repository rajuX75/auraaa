'use client';

import { useMutation } from 'convex/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export interface MoodBoardImage {
  id: string;
  file?: File;
  preview: string;
  storageId?: string;
  uploaded: boolean;
  uploading: boolean;
  error?: string;
  url?: string;
  isFromServer?: boolean;
}

interface StylesFormData {
  images: MoodBoardImage[];
}

export const useMoodBoard = (guideImages: MoodBoardImage[]) => {
  const [dragActive, setDragActive] = useState(false);
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');

  const form = useForm<StylesFormData>({
    defaultValues: {
      images: [],
    },
  });
  const { watch, setValue, getValues } = form;
  const images = watch('images');

  const generateUploadUrl = useMutation(api.moodboard.generateUploadUrl);
  const removeMoodBoardImage = useMutation(api.moodboard.removeMoodBoardImage);
  const addMoodBoardImage = useMutation(api.moodboard.addMoodBoardImage);

  const uploadImage = async (file: File): Promise<{ storageId: string; url?: string }> => {
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();
      if (projectId) {
        await addMoodBoardImage({
          projectId: projectId as Id<'projects'>,
          storageId: storageId as Id<'_storage'>,
        });
      }
      return { storageId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (guideImages && guideImages.length > 0) {
      const serverImages: MoodBoardImage[] = guideImages.map((img: any) => ({
        id: img.id,
        preview: img.url,
        storageId: img.storageId,
        uploaded: true,
        uploading: false,
        url: img.url,
        isFromServer: true,
      }));
      const currentImages = getValues('images');
      if (currentImages.length === 0) {
        setValue('images', serverImages);
      } else {
        const mergedImages = [...currentImages];
        serverImages.forEach((serverImg) => {
          const clientIndex = mergedImages.findIndex(
            (clientImg) => clientImg.storageId === serverImg.storageId
          );
          if (clientIndex !== -1) {
            if (
              mergedImages[clientIndex].preview &&
              mergedImages[clientIndex].preview.startsWith('blob:')
            ) {
              URL.revokeObjectURL(mergedImages[clientIndex].preview);
            }
            mergedImages[clientIndex] = serverImg;
          }
        });
        setValue('images', mergedImages);
      }
    }
  }, [guideImages, setValue, getValues]);

  const addImage = (file: File) => {
    if (images.length >= 5) {
      toast.error('Maximum 5 images allowed', {
        description: 'Remove an existing image before adding a new one to your mood board.',
      });
      return;
    }
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file (JPG, PNG, WebP, etc.).',
      });
      return;
    }

    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 10MB.',
      });
      return;
    }
    const newImage: MoodBoardImage = {
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      uploading: false,
      isFromServer: false,
    };
    const updatedImages = [...images, newImage];
    setValue('images', updatedImages);

    toast.success('Image added to moodboard');
  };
  const removeImage = async (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId);
    if (!imageToRemove) return;

    if (imageToRemove.isFromServer && imageToRemove.storageId && projectId) {
      try {
        await removeMoodBoardImage({
          projectId: projectId as Id<'projects'>,
          storageId: imageToRemove.storageId as Id<'_storage'>,
        });
      } catch (error) {
        console.error('Remove failed:', error);
        toast.error('Failed to remove image', {
          description: 'Please try again.',
        });
        return;
      }
    }
    const updatedImages = images.filter((img) => {
      if (img.id === imageId) {
        if (!img.isFromServer && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
        return false;
      }
      return true;
    });
    setValue('images', updatedImages);
    toast.success('Image removed');
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.filter((file) => file.type.startsWith('image/'));

    if (imageFile.length === 0) {
      toast.error('Please drop image files only');
      return;
    }

    imageFile.forEach((file) => {
      if (images.length < 5) {
        addImage(file);
      }
    });
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => addImage(file));

    e.target.value = '';
  };
  useEffect(() => {
    const uploadPendingImages = async () => {
      const currentImages = getValues('images');
      for (let i = 0; i < currentImages.length; i++) {
        const image = currentImages[i];
        if (!image.uploaded && !image.uploading && !image.error) {
          const updatedImages = [...currentImages];
          updatedImages[i] = { ...image, uploading: true };
          setValue('images', updatedImages);
          try {
            const { storageId } = await uploadImage(image.file!);
            const finalImages = getValues('images');
            const finalIndex = finalImages.findIndex((img) => img.id === image.id);
            if (finalIndex !== -1) {
              finalImages[finalIndex] = {
                ...finalImages[finalIndex],
                storageId,
                uploaded: true,
                uploading: false,
                isFromServer: true,
              };
              setValue('images', [...finalImages]);
            }
          } catch (error) {
            console.error(error);
            const errorImages = getValues('images');
            const errorIndex = errorImages.findIndex((img) => img.id === image.id);
            if (errorIndex !== -1) {
              errorImages[errorIndex] = {
                ...errorImages[errorIndex],
                uploading: false,
                error: 'upload Failed',
              };
              setValue('images', [...errorImages]);
            }
          }
        }
      }
    };
    if (images.length > 0) {
      uploadPendingImages();
    }
  }, [images, setValue, getValues]);
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);
  return {
    form,
    images,
    dragActive,
    addImage,
    removeImage,
    handleDrop,
    handleDrag,
    handleFileInput,
    canAddMore: images.length < 5,
  };
};
