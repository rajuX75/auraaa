import { MoodBoardImage } from '@/hooks/use-styles';
import { X } from 'lucide-react';
import Image from 'next/image';
import UploadStatus from './upload-status';

type Props = {
  image: MoodBoardImage;
  removeImage: (id: string) => void;
  xOffset: number;
  yOffset: number;
  rotation: number;
  zIndex: number;
  marginLeft: string;
  marginTop: string;
};

const ImageBoard = ({
  image,
  removeImage,
  xOffset,
  yOffset,
  rotation,
  zIndex,
  marginLeft,
  marginTop,
}: Props) => {
  return (
    <div
      key={`mobile-${image.id}`}
      className="absolute group"
      style={{
        transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`,
        zIndex: zIndex,
        left: '50%',
        top: '50%',
        marginLeft: marginLeft,
        marginTop: marginTop,
      }}
    >
      <div className="relative w-40 h-48 rounded-2xl overflow-hidden bg-white shadow-xl border border-border/20 hover:scale-105 transition-all duration-200">
        <Image src={image.preview} alt="Mood Board Image" fill className="object-cover" />
        <UploadStatus uploading={image.uploading} uploaded={image.uploaded} error={image.error} />
        <button
          onClick={() => removeImage(image.id)}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ImageBoard;
