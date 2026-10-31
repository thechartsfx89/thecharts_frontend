



const BASE_VDOCIPHER_URL = 'https://dev.vdocipher.com/api/videos'


const WEBSITE_NAME = '';

const DEFAULT_PAGE_SIZE = 10;

const API_ENDPOINTS = {
    me: '/users/me',
    filterUser: "/users",
    userSessions: '/user-sessions',
    login: '/auth/local',
    register: '/auth/local/register',
    email: '/email',
    blogs: '/blogs?populate=*',
    blogdetails: '/blogs',
    RelatedBlogs: '/blogs',
    courses:'/recorderd-lectures',
    purchasedCourses: '/purchased-courses',
    coursedetails:'/recorderd-lectures',
    forgotPassword: '/auth/forgot-password',
    quiz:'/quizzes',
    resetPassword: '/auth/reset-password',
    enrollCoursesDetail: '/recorderd-lectures',
    enrollCourses: '/users',
    videoProgress: '/video-progresses',
    faqs: '/faq',
    upload: '/upload',
    profile:'/users',
    sendEmailConfirmation: '/auth/send-email-confirmation',
    emailConfirmation: '/auth/email-confirmation',
    studentLibraries: '/student-libraries',
    quizScores: '/quiz-scores',
    refund: "/refunds",
    webinar: "/webinars",
    referral: "/referral-trees",
    userLevelCommission: "/commissions/user-level-summary",
    networkDownline: "/referral-tree/hierarchy",
    kyc: "/kyc-documents",
    userClubCommission: "/commissions/user-club-summary",
    // networkDownline: "/affiliate-trees/hierarchy",
    directReferral: "/referral-tree/hierarchy",
    // kyc: "/kyc-documents",
    transactionHistory: "/commissions",
    // transactionHistory: "/member-accounts",

    payout: "/payouts",

    genealogy: "/referral-tree/level",
    wallet: "/wallets",
    commissionStatsGraph: "/commissions/stats",

    billingHistory: "/payments",

    studentDash: "/student/dashboard",

    courseModules: "/course-modules",
    coursePlaylists: "/course-playlists",
    // teachers: "/student/dashboard",
    // enrollments: "/student/dashboard",
    // wallet: "/wallets",
    // commissionStatsGraph: "/commissions/stats",

    payment: "/payments",
    enquiry:"/contact-enquiries",
    bookDemoEmail: "/notifications/book-demo",
    enrollPaymentEmail: "/notifications/payment-submitted",

    levelOpenWindow: "/user-bonus-statuses",

    myWalletSummary: "/commissions/my-wallet-summary",
    affiliateDashDetails: "/affiliate/hierarchyDashDetails",
    admissionApproval: "/payments",
    kycApproval: "/kyc-documents",
    globalWalletSummary:"/commissions/admin/global-summary",
    withdrawApproval: "/payouts",

    globalUserSummary: "/commissions/admin/users-summary"

    // affiliateDashDetails: "/affiliate/hierarchyDashDetails",



};

const LS_KEYS = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    userData: "userData",
};

const RUPEE_HTML_CODE = "&#8377;";

export { API_ENDPOINTS, LS_KEYS, WEBSITE_NAME, DEFAULT_PAGE_SIZE, RUPEE_HTML_CODE, BASE_VDOCIPHER_URL };
