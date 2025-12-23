import http from "./request.js";

// 高亮相关 API
const baseURL = "/paper";

export const getPaperDetail = (id) => {
    return http({
        url: `${baseURL}/papers/${id}`,
        method: "get"
    });
};

export const getPaperPdfUrl = (pdfUrl) => {
    return http({
        url: `${baseURL}/files/url/${pdfUrl}`,
        method: "get"
    });
};

export const getPaperRef=(id) => {
    return http({
        url: `${baseURL}/papers/${id}/references`,
        method: "get",
        params :{ direction:"citations"}
    });
};