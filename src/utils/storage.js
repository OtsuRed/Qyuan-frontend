const token_key = 'vue_admin_template_token'
export function getToken() {
    return localStorage.getItem(token_key)
}
export function setToken(token) {
    return localStorage.setItem(token_key, token)
}
export function removeToken() {
    return localStorage.removeItem(token_key)
}
export function getUser() {
    return JSON.parse(localStorage.getItem('user'))
}
//登录时保存用户信息
export function setUser(user) {
    return localStorage.setItem('user', JSON.stringify(user))
}
export function removeUser() {
    return localStorage.removeItem('user')
}
const theme_key = 'qyuan_theme'
export function getTheme() {
    return localStorage.getItem(theme_key) || 'light'
}
export function setTheme(theme) {
    return localStorage.setItem(theme_key, theme)
}
export const category =[
    {id:1,name:"高能物理-现象学"},
    {id:2,name:"高能物理-理论"},
    {id:3,name:"数学"},
    {id:4,name:"物理学"},
    {id:5,name:"计算机科学"},
    {id:6,name:"天体物理学"},
    {id:7,name:"凝聚态物理"},
    {id:8,name:"量子物理"}
]