import { resolveCheckoutPrice } from '@/lib/course-pricing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.user?.id || !token?.jwt) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await resolveCheckoutPrice(params.id, token.user.id, token.jwt);
        return NextResponse.json({ data }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (err: any) {
        const status = err?.response?.status ?? 500;
        return NextResponse.json({ error: err?.response?.data?.error?.message ?? 'Failed to fetch price' }, { status });
    }
}
