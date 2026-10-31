import { NextRequest, NextResponse } from 'next/server';
import apiService from '@/lib/axios';
import { API_ENDPOINTS } from '@/api-constant';

// Make sure API_ENDPOINTS.faq = '/faq' or '/faqs' in your constants file

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

  

    const response = await apiService.get(`${API_ENDPOINTS.faqs}?populate=*`, );

    const { data, meta } = response.data ?? {};

    return NextResponse.json(
      { data, meta },
      {
        status: response.status,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message =
      err?.response?.data?.error?.message ?? 'Failed to fetch FAQs';
    return NextResponse.json({ error: message, status }, { status });
  }
}
