import ComponentsaffiliateAccountSettingsTabs from '@/components/users/account-settings/components-affiliate-account-settings-tabs';
import ComponentsUsersAccountSettingsTabs from '@/components/users/account-settings/components-users-account-settings-tabs';
import { Metadata } from 'next';
import { Settings } from 'lucide-react';
import { AffiliatePageHeader } from '@/components/layouts/affiliate/affiliate-ui';
import React from 'react';

export const metadata: Metadata = {
    title: 'Account Setting',
};

const UserAccountSettings = () => {
    return (
        <div>
            <AffiliatePageHeader title="Account Settings" icon={Settings} parents={[{ label: "View Profile", href: "/dash/affiliate/profile" }]} />
            <ComponentsaffiliateAccountSettingsTabs/>
        </div>
    );
};

export default UserAccountSettings;


