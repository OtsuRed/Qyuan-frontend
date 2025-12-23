import http from "./request.js";
//为http增加请求前缀read_notes
const baseURL = "/read_notes/record";
export const createReadRecord = (data) => {
    return http({
            url: `${baseURL}/createReadRecord`,
            method: "post",
            data: data
        });
};

export const getReadRecord = (paper_id) => {
    return http({
            url: `${baseURL}/getReadRecord/${paper_id}`,
            method: "get"
        });
};

export const updateReadRecord = (data,record_id) => {
    return http({
            url: `${baseURL}/updateReadRecord/${record_id}`,
            method: "post",
            data: data
        });
};

export const getReadRecordByPage = (page_data) => {
    return http({
            url: `${baseURL}/getReadRecordByPage`,
            method: "get",
            params: page_data
        });
};