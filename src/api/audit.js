import http from "./request.js";
//为http增加请求前缀read_notes
const baseURL = "/manage";
const claimURL = "/paper/user";
export const getReportList = (page_num,page_size,status) => {
    return http({
        url: `${baseURL}/report/reportList`,
        method: "get",
        params: {
            "page_num":page_num,
            "page_size":page_size,
            "status":status
        },
    });
};
export const createReport = (params,formData) => {
    return http({
        url: `${baseURL}/report/createReport`,
        method: "post",
        params: params,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'  // 让浏览器自动设置，或手动设置
        }
    });
};

export const auditReport = (data) => {
    return http({
        url: `${baseURL}/audit/report`,
        method: "post",
        data: data
    });
};

export const getClaimList = (page_num,page_size,status) => {
    return http({
        url: `${claimURL}/getAllClaim`,
        method: "get",
        params: {
            "page":page_num,
            "size":page_size,
            "status":status
        },
    });
};

export const updateClaim = (data,claim_id) => {
    return http({
        url: `${claimURL}/updateClaim/${claim_id}`,
        method: "post",
        data: data
    });
};