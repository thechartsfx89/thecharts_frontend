// import { API_ENDPOINTS } from "app-constants";
// import { apiService } from "./apiService";
import { API_ENDPOINTS } from "@/api-constant";
import apiService from "@/lib/axios";
import { UserLoginReq, UserLoginRes } from "@/types/user";
// import { GetProfileRes, UserLoginRes, UserLoginReq, } from "types/User";

function logoutService() {

}

function loginService(data: UserLoginReq) {
    return apiService.post<UserLoginRes>(
        API_ENDPOINTS.login,
        data
    );
}

export {
    logoutService,
    loginService,
   
}