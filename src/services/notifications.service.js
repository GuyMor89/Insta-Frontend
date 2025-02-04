import { httpService } from "./http.service.js"

const BASE_URL = 'notifications/'

export const notificationService = {
    query,
    createNotification,
    addActivity,
    markRead
}

function query() {
    return httpService.get(BASE_URL)
}

function createNotification() {
    return httpService.post(BASE_URL)
}

function addActivity(userID, activity) {
    return httpService.put(BASE_URL + userID, activity)
}

function markRead() {
    return httpService.put(BASE_URL + 'read')
}
