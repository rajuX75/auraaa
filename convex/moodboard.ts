import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getMoodBoardImages = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== userId) {
      return [];
    }

    const storageIds = project.moodBoardImages || [];
    const images = await Promise.all(
      storageIds.map(async (storageId, index) => {
        try {
          const url = await ctx.storage.getUrl(storageId);
          return {
            id: `convex-${storageId}`, // Unique id for client side tracking
            storageId,
            uploaded: true,
            uploading: false,
            index, // Preserve order
            url,
          };
        } catch (error) {
          console.error(`Failed to get URL for storage ID ${storageId}:`, error);
          return null;
        }
      })
    );

    return images.filter((image) => image !== null).sort((a, b) => a!.index - b!.index);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const addMoodBoardImage = mutation({
  args: {
    projectId: v.id('projects'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const project = await ctx.db.get(projectId);
    if (!project) throw new Error('Project not found');
    if (project.userId !== userId) {
      throw new Error('Access denied');
    }

    const currentImages = project.moodBoardImages || [];
    if (currentImages.length >= 5) {
      throw new Error('Maximum 5 mood board images allowed');
    }
    const updatedImages = [...currentImages, storageId];
    await ctx.db.patch(projectId, {
      moodBoardImages: updatedImages,
      lastModified: Date.now(),
    });
    return { success: true, imageCount: updatedImages.length };
  },
});

export const removeMoodBoardImage = mutation({
  args: {
    projectId: v.id('projects'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const project = await ctx.db.get(projectId);
    if (!project) throw new Error('Project not found');
    if (project.userId !== userId) {
      throw new Error('Access denied');
    }

    const currentImages = project.moodBoardImages || [];
    const updatedImages = currentImages.filter((id) => id !== storageId);

    await ctx.db.patch(projectId, {
      moodBoardImages: updatedImages,
      lastModified: Date.now(),
    });

    // Attempt to delete from storage, but don't fail the operation if it fails
    try {
      await ctx.storage.delete(storageId);
    } catch (error) {
      console.error(`Failed to delete mood board image from storage ${storageId}:`, error);
    }
    return { success: true, imageCount: updatedImages.length };
  },
});
