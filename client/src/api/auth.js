import {getHeaders, API} from "./apiClient.js";
export async function register(data){
    const res = await fetch(`${API.auth}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function login(data){
    const res = await fetch(`${API.auth}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function getMe(token){
    const res = await fetch(`${API.auth}/me`, {
        headers: getHeaders(token),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}