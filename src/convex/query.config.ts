import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { ConvexUserRaw, normalizeProfile } from '../types/user';

export const ProfileQuery = async () => {
  try {
    return await preloadQuery(
      api.user.getCurrentUser,
      {},
      { token: await convexAuthNextjsToken() }
    );
  } catch (error) {
    console.error('Failed to load profile:', error);
    throw error;
  }
};
export const SubscriptionEntitlementQuery = async () => {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(rawProfile._valueJSON as unknown as ConvexUserRaw | null);

  // Early return if no valid profile
  if (!profile?.id) {
    return {
      entitlement: null,
      profileName: null,
      hasValidProfile: false,
    };
  }

  try {
    const entitlement = await preloadQuery(
      api.subscription.hasEntitlement,
      { userId: profile.id as Id<'users'> },
      { token: await convexAuthNextjsToken() }
    );

    return {
      entitlement,
      profileName: profile.name,
      hasValidProfile: true,
    };
  } catch (error) {
    console.error('Failed to check subscription entitlement:', error);
    return {
      entitlement: null,
      profileName: profile.name,
      hasValidProfile: true,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const ProjectQuery = async () => {
  const rawProfile = await ProfileQuery();
  const profile = normalizeProfile(rawProfile._valueJSON as unknown as ConvexUserRaw | null);
  if (!profile?.id) {
    return { projects: null, profile: null };
  }
  const projects = await preloadQuery(
    api.projects.getUserProjects,
    { userId: profile.id as Id<'users'> },
    { token: await convexAuthNextjsToken() }
  );
  return { projects, profile };
};


export const StyleGuideQuery = async (projectId: string) => {
  const styleGuide = await preloadQuery(
    api.projects.getProjectStyleGuide,
    { projectId: projectId as Id<'projects'> },
    { token: await convexAuthNextjsToken() }
  );
  return { styleGuide };
};

export const MoodBoardImagesQuery = async (projectId: string) => {
  const images = await preloadQuery(
    api.moodboard.getMoodBoardImages,
    { projectId: projectId as Id<'projects'> },
    { token: await convexAuthNextjsToken() }
  );
  return { images };
};
