export interface IApiResponse<T> {
    jwt: string;
    data: T;
    message: string;
    status: number;
}

export interface ISelectOption {
    label: string;
    value: string | boolean | number;
    disabled?: boolean;
    mode?: any
}

export interface IPagination {
    pageNumber: number;
    pageSize: number;
}

export enum PaymentMode {
  RAZORPAY = "RAZORPAY",
  HDFC = "HDFC",
  DIGITAL_PAYMENT = "DIGITAL_PAYMENT",
  BANK_DEPOSIT = "BANK_DEPOSIT",
  ONLINE_TRANSFER = "ONLINE_TRANSFER",
  CASH = "CASH",
}
