// The public course catalogue: marketing copy, benefits and list prices for the landing and detail pages.
// Checkout charges course_price from Strapi; thechartsfx_backend/scripts/apply-course-catalogue.js keeps it equal to these prices.

export type CatalogueKey = 'foundation' | 'advanced' | 'premium' | 'news_trading' | 'one_to_one';

export const COURSE_CURRENCY = 'USD';
export const NEWS_TRADING_BUNDLE_DISCOUNT = 0.25;

export type CatalogueEntry = {
    key: CatalogueKey;
    slug: string;
    name: string;
    tagline: string;
    regularPrice: number;
    price: number;
    priceNote?: string;
    featured?: boolean;
    // Only these two existing courses have student reviews behind them
    hasReviews?: boolean;
    includes: string[];
    additionalBenefits?: string[];
    notIncluded?: string[];
    // Shown instead of a benefits list when the programme's contents are not confirmed yet
    pendingDetails?: string;
};

export const CATALOGUE: CatalogueEntry[] = [
    {
        key: 'foundation',
        slug: 'foundation',
        name: 'Foundation Course',
        tagline: 'For beginners ready to take their first step',
        regularPrice: 600,
        price: 499,
        hasReviews: true,
        includes: ['2 months of course access', '45 days of classes', '15 days of doubt sessions'],
        notIncluded: ['Journal sessions', 'Psychology sessions'],
    },
    {
        key: 'advanced',
        slug: 'advanced',
        name: 'Advanced Course',
        tagline: 'For serious traders who want an edge',
        regularPrice: 799,
        price: 599,
        featured: true,
        hasReviews: true,
        includes: ['Everything in the Foundation Course', '95 days of journal access (45 days of sessions plus 60 days of doubt sessions)', 'Psychology session access', 'Monthly live trading sessions'],
    },
    {
        key: 'premium',
        slug: 'premium',
        name: 'Premium Course',
        tagline: 'For committed traders who want the complete programme',
        regularPrice: 1199,
        price: 999,
        includes: ['All features and access in the Foundation and Advanced Courses', 'All Advanced Course video access', 'Weekly live trading sessions'],
        additionalBenefits: [
            'The opportunity to join an exclusive social trading community',
            'The opportunity to become part of the Trading Floor',
            'Trading tools and the trading journals of previous students, to help you become wiser and more disciplined in less time',
            'Insight into the mindset of both beginner and professional traders',
            'Eligibility to join the Membership Programme',
        ],
    },
    {
        key: 'news_trading',
        slug: 'news-trading',
        name: 'News Trading',
        tagline: 'Trade market-moving news events with a plan',
        regularPrice: 100,
        price: 100,
        priceNote: '25% off when purchased with any course',
        includes: ['Complete fundamental analysis', 'Live trading sessions on news events', 'Review of important news events from the previous three years, including backtesting sessions'],
    },
    {
        key: 'one_to_one',
        slug: 'one-to-one',
        name: 'One-to-One Membership',
        tagline: 'Personal membership with one-to-one access',
        regularPrice: 199,
        price: 160,
        includes: [],
        pendingDetails: 'Full membership details will be published soon. Contact us if you would like to know more before enrolling.',
    },
];

export const CORE_COURSES = CATALOGUE.filter((c) => ['foundation', 'advanced', 'premium'].includes(c.key));
export const ADD_ON_PROGRAMMES = CATALOGUE.filter((c) => ['news_trading', 'one_to_one'].includes(c.key));

export const courseDetailHref = (entry: CatalogueEntry) => `/courses/course-details/${entry.slug}`;
export const entryForKey = (key?: string | null) => CATALOGUE.find((c) => c.key === key);
export const entryForSlug = (slug?: string | null) => CATALOGUE.find((c) => c.slug === slug);

// Catalogue order, so listings read from entry level upward whatever order Strapi returns
export function sortByCatalogue<T extends { catalogue_key?: string | null }>(courses: T[]): T[] {
    const rank = (c: T) => {
        const i = CATALOGUE.findIndex((e) => e.key === c.catalogue_key);
        return i === -1 ? CATALOGUE.length : i;
    };
    return [...courses].sort((a, b) => rank(a) - rank(b));
}

// true = included, false = not included, null = not confirmed yet, string = included, with this detail
export type ComparisonValue = boolean | string | null;
export type ComparisonRow = { label: string; values: Record<CatalogueKey, ComparisonValue> };

export const COMPARISON_ROWS: ComparisonRow[] = [
    { label: 'Essential checklist and benefits', values: { foundation: true, advanced: true, premium: true, news_trading: true, one_to_one: null } },
    { label: 'Duration', values: { foundation: '2 months', advanced: null, premium: null, news_trading: null, one_to_one: null } },
    { label: 'Classes', values: { foundation: '45 days', advanced: true, premium: true, news_trading: false, one_to_one: null } },
    { label: 'Doubt sessions', values: { foundation: '15 days', advanced: '60 days', premium: '60 days', news_trading: false, one_to_one: null } },
    { label: 'Psychology access', values: { foundation: false, advanced: true, premium: true, news_trading: false, one_to_one: null } },
    { label: 'Journal access', values: { foundation: false, advanced: '95 days', premium: '95 days', news_trading: false, one_to_one: null } },
    { label: 'Live trading sessions', values: { foundation: false, advanced: 'Monthly', premium: 'Weekly', news_trading: 'News events', one_to_one: null } },
    { label: 'Fundamental analysis and news backtesting', values: { foundation: false, advanced: false, premium: false, news_trading: true, one_to_one: null } },
    { label: 'Social trading community and Trading Floor', values: { foundation: false, advanced: false, premium: true, news_trading: false, one_to_one: null } },
    { label: 'Trading tools and past student journals', values: { foundation: false, advanced: false, premium: true, news_trading: false, one_to_one: null } },
    { label: 'Affiliate programme eligibility', values: { foundation: false, advanced: true, premium: true, news_trading: false, one_to_one: false } },
];

const format = (amount: number, currency: string) =>
    new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(amount);

export const formatPrice = (amount: number | string | null | undefined) => format(Number(amount || 0), COURSE_CURRENCY);

// Payments made before the catalogue change have no currency recorded and were all in rupees
export const formatRecordedAmount = (amount: number | string | null | undefined, currency?: string | null) => format(Number(amount || 0), currency || 'INR');

// A course without a catalogue key has not been migrated, so its stored price is still in rupees
export const courseCurrency = (course?: { catalogue_key?: string | null } | null) => (course?.catalogue_key ? COURSE_CURRENCY : 'INR');
export const formatCoursePrice = (course?: { catalogue_key?: string | null; course_price?: number | string | null } | null) => format(Number(course?.course_price || 0), courseCurrency(course));
