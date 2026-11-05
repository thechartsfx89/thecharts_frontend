import { API_ENDPOINTS } from '@/api-constant';
import apiService from '@/lib/axios';
import { courseCurrency, NEWS_TRADING_BUNDLE_DISCOUNT } from '@/utils/course-catalogue';

const VOIDED_PAYMENT_STATUSES = ['FAILED', 'REJECTED', 'REFUNDED', 'REFUND_REQ'];
const NON_COURSE_KEYS = ['news_trading', 'one_to_one'];

// A student qualifies for the News Trading bundle once they have a live payment on any course
async function holdsAnyCourse(userId: number, jwt: string) {
    const res = await apiService.get(API_ENDPOINTS.purchasedCourses, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: {
            'filters[user][id][$eq]': userId,
            'populate[course][fields][0]': 'catalogue_key',
            'populate[payment][fields][0]': 'payment_status',
            'pagination[pageSize]': 100,
        },
    });
    return (res.data?.data ?? []).some((purchase: any) => purchase.course && purchase.payment && !NON_COURSE_KEYS.includes(purchase.course.catalogue_key) && !VOIDED_PAYMENT_STATUSES.includes(purchase.payment.payment_status));
}

// The amount a student owes for a course; the checkout display and the recorded payment both come from here
export async function resolveCheckoutPrice(courseDocumentId: string, userId: number, jwt: string) {
    const res = await apiService.get(`${API_ENDPOINTS.coursedetails}/${courseDocumentId}`);
    const course = res.data?.data;
    const listPrice = Number(course?.course_price ?? 0);
    const bundleApplied = course?.catalogue_key === 'news_trading' && (await holdsAnyCourse(userId, jwt));

    return {
        listPrice,
        amount: bundleApplied ? listPrice * (1 - NEWS_TRADING_BUNDLE_DISCOUNT) : listPrice,
        currency: courseCurrency(course),
        bundleApplied,
    };
}
