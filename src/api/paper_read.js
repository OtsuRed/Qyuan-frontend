import http from "./request.js";
//为http增加请求前缀read_notes
http.defaults.baseURL = "/api/read_notes";
export const createReadRecord = (data) => {
    return http({
            url: "/createReadRecord",
            method: "post",
            data: data
        });
};