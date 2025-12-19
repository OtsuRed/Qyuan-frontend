import http from "./request.js";
//为http增加请求前缀read_notes
http.defaults.baseURL = "/api/read_notes/record";
export const createReadRecord = (data) => {
    return http({
            url: "/createReadRecord",
            method: "post",
            data: data
        });
};

export const getReadRecord = (paper_id) => {
    return http({
            url: `/getReadRecord/${paper_id}`,
            method: "get"
        });
};

export const updateReadRecord = (data,record_id) => {
    return http({
            url: `/updateReadRecord/${record_id}`,
            method: "post",
            data: data
        });
};

export const getReadRecordByPage = (page_data) => {
    return http({
            url: `/getReadRecordByPage`,
            method: "get",
            params: page_data
        });
};