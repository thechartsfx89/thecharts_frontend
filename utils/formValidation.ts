import * as yup from 'yup';

// export interface LoginForm {
//     identifier: string;
//     password: string;
//     rememberMe: boolean;
// }

export const loginSchema = yup.object({
    identifier: yup.string().required('Identifier is required'),
    password: yup.string().required('Password is required'),
    rememberMe: yup.boolean().optional(),
});
export type LoginForm = yup.InferType<typeof loginSchema>;
// export interface ResetPasswordForm {
//     newPassword: string;
//     confirmNewPassword: string;
// }

export const resetPasswordSchema = yup.object({
    newPassword: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),

    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your password'),
});
export type ResetPasswordForm = yup.InferType<typeof resetPasswordSchema>;
export interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    country: string;
    dob: Date;
    // referralCode?: string;
    referralName?: string; // optional
    password: string;
    confirmPassword: string;
    terms: boolean;
    gender: string;
    address?: string;
    role?: number;
    captcha?: string;
    referralBy?: string;
    referralByCode?: string;
}

// 👇 Yup Schema (SchemaOf enforces type safety)
export const registerSchema: yup.ObjectSchema<RegisterForm> = yup.object({
    firstName: yup
        .string()
        .required('First name is required')
        .matches(/^[A-Za-z ]+$/, 'Only alphabets are allowed'),

    lastName: yup
        .string()
        .required('Last name is required')
        .matches(/^[A-Za-z ]+$/, 'Only alphabets are allowed'),

    email: yup.string().email('Enter a valid email').required('Email is required'),

    mobileNumber: yup
        .string()
        .required('Mobile is required')
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),

    country: yup.string().required('Country is required'),

    address: yup.string().optional(),

    dob: yup
        .date()
        .transform((value, originalValue) => {
            return originalValue === '' ? null : value;
        })
        .nullable()
        .required('Date of birth is required')
        .max(new Date(), 'Date of birth cannot be in the future'),

    // gender: yup
    //     .string()
    //     .oneOf(["male", "female", "other"], "Invalid gender selection")
    //     .required("Gender is required"),
    gender: yup.string().required('Gender is required').oneOf(['male', 'female', 'other'], 'Gender is required'),

    referralByCode: yup.string().required("Referral code is required"),

    referralBy: yup.string().optional(),

    referralName: yup.string().required("Field is required"),

    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),

    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),

    terms: yup.boolean().oneOf([true], 'You must accept the terms').required('You must accept the terms & conditions'),

    role: yup.number().optional(),
    // captcha: yup.string().required('Captcha verification is required'),
    captcha: yup.string().optional(),

});

export interface ProfileForm {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    country: string;
    dob: string;
    gender: string;
    father_husband_name?: string;
    nominee_name?: string;
    nominee_dob?: string;
    nominee_relation?: string;
    address?: string;
    pincode?: string;
}
export const profileSchema: yup.ObjectSchema<ProfileForm> = yup.object({
    firstName: yup
        .string()
        .required('First name is required')
        .matches(/^[A-Za-z ]+$/, 'Only alphabets are allowed'),

    lastName: yup
        .string()
        .required('Last name is required')
        .matches(/^[A-Za-z ]+$/, 'Only alphabets are allowed'),

    email: yup.string().email('Enter a valid email').required('Email is required'),

    mobileNumber: yup
        .string()
        .required('Mobile is required')
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),

    country: yup.string().required('Country is required'),

    dob: yup
        .string()
        .required('Date of birth is required')
        .test('not-future', 'Date of birth cannot be in the future', (value) => {
            if (!value) return false;
            return new Date(value) <= new Date();
        }),

    gender: yup.string().required('Gender is required').oneOf(['male', 'female', 'other', 'Male', 'Female'], 'Gender is required'),
    father_husband_name: yup.string().optional(),
    nominee_name: yup.string().optional(),

    address: yup.string().optional(),
    nominee_dob: yup.string().nullable().notRequired(),

    pincode: yup.string().optional(),
    nominee_relation: yup.string().optional(),
});

export interface ForgotPasswordForm {
    identifier: string;
}

export const ForgotSchema = yup.object({
    identifier: yup.string().email().required('Email is required'),
});

export interface RefundForm {
    refund_reason: string;
    description: string;
}
export const refundSchema: yup.ObjectSchema<RefundForm> = yup.object({
    refund_reason: yup.string().required('Field required'),

    description: yup.string().required('Field required'),
});



export const paymentSchema = yup.object({
  bank_name: yup.string().optional(),
  transaction_id: yup.string().optional(),
  payment_date: yup
    .date()
    .required("Payment Date is required"),
  payment_mode: yup
    .string()
    .optional(),
    payment_status: yup
    .mixed<"SUCCESS" | "FAILED" | "PENDING" | "UNDER_VERIFICATION">()
    .optional(),

  course: yup.string().optional(),
  user: yup.string().optional(),
  purchased_course: yup.string().optional(),
});

export type PaymentForm = yup.InferType<typeof paymentSchema>;
