import type { TreeNodeData } from '@/components/tree-node';
import { formatDateTime } from '../dateFormatter';

interface ApiUser {
    id: number;
    username: string;
    fullName: string;
    doc_date: string;
    confirm_affiliate_payment: boolean;
    status?: boolean;
    profile_image?: any;
    profile_img_path?: any;
    createdAt?: any
}

interface ApiResponse {
    userId: number;
    level: number;
    count: number;
    root: any;
    users: ApiUser[];

}

export function mapReferralTree(data: ApiResponse): TreeNodeData {
    return {
        id: `${data?.root?.id}`,
        name: `${data.root?.name}`,
        designation: `${data.root?.designation} - ${data.root?.docDate ? formatDateTime(data.root?.docDate) : formatDateTime(data.root?.createdAt)}`,
        level: 1,
        status: data?.root?.status ? 'confirmed' : 'not-confirmed',
        profile_image: data?.root?.profile_image,
        profile_img_path: data?.root?.profile_img_path,
        children: data.users.map((user) => ({
            id: String(user.id),
            name: user.fullName,
            designation: `${user.username} - ${user?.doc_date ? formatDateTime(user.doc_date) : formatDateTime(user?.createdAt)}`,
            level: data.level,
            status: user.confirm_affiliate_payment ? 'confirmed' : 'not-confirmed',
            profile_image: user?.profile_image,
            profile_img_path: user?.profile_img_path,
            children: [],
        })),
    };
}
