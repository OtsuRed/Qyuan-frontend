import http from "./request.js";
//为http增加请求前缀
const baseURL = "/es";

export const paperSearch = (params,categories) => {
    let url = `${baseURL}/paper/search?`;
    categories.forEach(category => {
        url+= `&categoryIds=${category}`
    })
    return http({
        url: url,
        method: "get",
        params: params
    });
};
