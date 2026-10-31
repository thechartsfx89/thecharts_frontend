import { UserRole } from "enum/common";
import { IApiResponse } from "./Common";

export type UserLoginReq = {
    emailId: string;
    password: string;
}

export type UserData = {
    id: number
    username: string
    name: string
    email: string
    contactNumber: string
    manager: string
    address: string
    zone: string
    joiningDate: string
    isCheckInMarked: boolean
    isCheckOutMarked: boolean
    role: UserRole
    image: string
}
export type UserLoginRes = IApiResponse<{
    jwt: string
    user: UserData
}>
export type UserAuthRes = IApiResponse<{
   user: UserData
}>
export type GetProfileRes = IApiResponse<UserData>

export type CreateUserReq = {
    firstname: string
    lastname: string
    email: string
    password: string
    address: string
    age: number
    zone: string
    phone: string
    joining_date: date
    managerId: number
    role: string
    
  }
  export type CreateUserRes = IApiResponse<{
    message: string;
  }>
export type ForgotRes = IApiResponse<{
    data: any;
    message: string;
    status: number;
}>

