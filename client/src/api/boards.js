import {getHeaders, API} from "./apiClient.js";

export async function getBoards(token){
    const res = await fetch(API.boards, {headers: getHeaders(token) })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function getBoard(token,id){
    const res = await fetch(`${API.boards}/${id}`, {headers: getHeaders(token)})
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function createBoard(token,data){
    const res = await fetch(API.boards, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    })
    
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function deleteBoard(token,id){
    const res = await fetch(`${API.boards}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
    })
    if(!res.ok) throw await res.json()
}

export async function inviteMembers(token,boardId,email){
    const res = await fetch(`${API.boards}/${boardId}/members`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify({ email })
        })
    if(!res.ok) throw await res.json()
    return res.json()
}

    