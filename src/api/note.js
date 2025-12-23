import http from "./request.js";
//为http增加请求前缀read_notes
const baseURL = "/read_notes/note";
export const addNotes =(data)=>{
    return http({
        url:`${baseURL}/addNotes`,
        method:"post",
        data:data
    })
}
export const getNotes =(paper_id)=>{
    return http({
        url:`${baseURL}/${paper_id}`,
        method:"get"
    })
}

export const updateNotes =(data)=>{
    return http({
        url:`${baseURL}/updateNotes`,
        method:"post",
        data:data
    })
}
export const deleteNotes =(data)=>{
    return http({
        url:`${baseURL}/deleteNotes`,
        method:"post",
        data:data
    })
}