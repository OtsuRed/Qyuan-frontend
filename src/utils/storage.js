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
