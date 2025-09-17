import Navbar from '@/components/navbar';
import { SubscriptionEntitlementQuery } from '@/convex/query.config';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const { profileName, entitlement } = await SubscriptionEntitlementQuery();
  if (!entitlement?._valueJSON) {
    // redirect(`/dashboard/${combinedSlug(profileName!)}`);
    // redirect(`/billing/${combinedSlug(profileName!)}`);
  }
  return (
    <div className="grid grid-cols-1">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
