'use client';
import { getTranslation } from '@/i18n';
import { useSession } from 'next-auth/react';
import { BookOpen, GraduationCap, LayoutDashboard, MessagesSquare, ReceiptText, Share2, UserRoundCheck, Video } from 'lucide-react';
import DashSidebar from '../dash-sidebar';

const StudentSidebar = () => {
    const { t } = getTranslation();
    const { data: session } = useSession<any>();
    const role = session?.user?.role;

    return (
        <DashSidebar
            label="Student panel"
            sections={[
                {
                    items: [{ label: t('Dashboard'), icon: LayoutDashboard, href: role == 'mentor' ? `/dash/mentor` : role == 'student' ? `/dash/student` : '#', exact: true }],
                },
                {
                    title: t('Explore'),
                    items: [
                        {
                            label: t('Courses'),
                            icon: BookOpen,
                            children: [
                                { label: t('Enroll course'), href: '/dash/student/enroll-course' },
                                { label: t('All Courses'), href: '/courses' },
                            ],
                        },
                        { label: t('Live Webinar'), icon: Video, href: '/dash/student/live-webinar/list', activeHref: '/dash/student/live-webinar' },
                        { label: t('One to One Teaching'), icon: GraduationCap, href: '/dash/student/oneToOneTeaching' },
                        ...(role == 'student' ? [{ label: t('Mentor Panel'), icon: UserRoundCheck, href: '/dash/student/mentor' }] : []),
                        ...(role == 'mentor' ? [{ label: t('Mentor Panel'), icon: UserRoundCheck, href: '/dash/student/student' }] : []),
                        { label: t('Billing History'), icon: ReceiptText, href: '/dash/student/billing' },
                        { label: t('Share / Earn'), icon: Share2, href: '/dash/student/share-earn' },
                    ],
                },
                {
                    title: t('supports'),
                    items: [{ label: t('Community Support'), icon: MessagesSquare, href: '/dash/student/community' }],
                },
            ]}
        />
    );
};

export default StudentSidebar;
