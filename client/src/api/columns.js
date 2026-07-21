import {getHeaders, API} from "./apiClient.js";

export async function getColumns(token,boardId){
    const res = await fetch(`${API.columns}/board/${boardId}`, {
        headers: getHeaders(token),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function createColumn(token, data){
    const res = await fetch(API.columns, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function updateColumn(token, id, data){
    const res = await fetch(`${API.columns}/${id}`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function deleteColumn(token, id){
    const res = await fetch(`${API.columns}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}