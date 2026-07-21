const BASE_URL = 'http://localhost:6000'

export function getHeaders(token) {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export function getPublicHeaders(){
    return {
        'Content-Type': 'application/json',
    }
}

export const API = {
    auth: `${BASE_URL}/api/auth`,
    boards: `${BASE_URL}/api/boards`,
    columns: `${BASE_URL}/api/columns`,
    cards: `${BASE_URL}/api/cards`,
}