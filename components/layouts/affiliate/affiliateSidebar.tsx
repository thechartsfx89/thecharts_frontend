'use client';
import { getTranslation } from '@/i18n';
import { useSession } from 'next-auth/react';
import { Landmark, LayoutDashboard, Link2, Network, UserRound, Users, Wallet } from 'lucide-react';
import DashSidebar from '../dash-sidebar';

const AffiliateSidebar = () => {
    const { t } = getTranslation();
    const { data: session } = useSession<any>();
    const role = session?.user?.role;

    return (
        <DashSidebar
            label="Affiliate panel"
            sections={[
                {
                    items: [{ label: t('Dashboard'), icon: LayoutDashboard, href: role == 'mentor' ? `/dash/mentor` : role == 'student' ? `/dash/affiliate` : '#', exact: true }],
                },
                {
                    title: t('EXPLORE'),
                    items: [
                        {
                            label: t('My Profile'),
                            icon: UserRound,
                            children: [
                                { label: t('View Profile'), href: '/dash/affiliate/profile' },
                                { label: t('KYC Details'), href: '/dash/affiliate/kyc-details' },
                            ],
                        },
                        {
                            label: t('My Network'),
                            icon: Users,
                            children: [
                                { label: t('Genealogy'), href: '/dash/affiliate/genealogy' },
                                { label: t('Direct Referral List'), href: '/dash/affiliate/my-sponsor-list' },
                                { label: t('All Downline List'), href: '/dash/affiliate/downline-list' },
                            ],
                        },
                        {
                            label: t('Tree Manager'),
                            icon: Network,
                            children: [
                                { label: t('Level Tree'), href: '/dash/affiliate/level-report' },
                                { label: t('Club Tree'), href: '/dash/affiliate/club-report' },
                            ],
                        },
                        {
                            label: t('Financial Manager'),
                            icon: Landmark,
                            children: [
                                { label: t('Payout Request'), href: '/dash/affiliate/payout-request' },
                                { label: t('Payout Report'), href: '/dash/affiliate/payout-report' },
                            ],
                        },
                        {
                            label: t('E-Wallet Manager'),
                            icon: Wallet,
                            children: [
                                { label: t('My E-Wallet'), href: '/dash/affiliate/wallet' },
                                { label: t('Transaction History'), href: '/dash/affiliate/transaction-history' },
                            ],
                        },
                        { label: t('Affiliate Link'), icon: Link2, href: '/dash/affiliate/share-earn' },
                    ],
                },
            ]}
        />
    );
};

export default AffiliateSidebar;
