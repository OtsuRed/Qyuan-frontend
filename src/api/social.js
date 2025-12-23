import http from "./request.js";
//为http增加请求前缀read_notes
const baseURL = "/social";


// 获取用户系统消息列表
export const getListUserMeaasge = (page, size) => {

    return http.get(`${baseURL}/getListUserMessage/1`, {
        params: {
            page: page,
            size: size
        }
    })
}