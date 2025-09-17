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
