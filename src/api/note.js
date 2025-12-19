import http from "./request.js";
//为http增加请求前缀read_notes
http.defaults.baseURL = "/api/read_notes/note";

export const addNotes =(data)=>{
    return http({
        url:"/addNotes",
        method:"post",
        data:data
    })
}
export const getNotes =(paper_id)=>{
    return http({
        url:`/${paper_id}`,
        method:"get"
    })
}

export const updateNotes =(data)=>{
    return http({
        url:`/updateNotes`,
        method:"post",
        data:data
    })
}
export const deleteNotes =(data)=>{
    return http({
        url:`/deleteNotes`,
        method:"post",
        params:data
    })
}