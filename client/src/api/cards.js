import {getHeaders, API} from "./apiClient.js";

export async function getCards(token, boardId){
    const res = await fetch(`${API.cards}/board/${boardId}`, {
        headers: getHeaders(token),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function createCard(token, data){
    const res = await fetch(API.cards, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function updateCard(token, id, data){
    const res = await fetch(`${API.cards}/${id}`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}

export async function deleteCard(token, id){
    const res = await fetch(`${API.cards}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
    })
    if(!res.ok) throw await res.json()
}

export async function moveCard(token, data){
    const res = await fetch(`${API.cards}/move`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    })
    if(!res.ok) throw await res.json()
    return res.json()
}