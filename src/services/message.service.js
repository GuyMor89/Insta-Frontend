import { httpService } from "./http.service.js"

const BASE_URL = 'messages/'

export const messageService = {
    query,
    add,
    addLine,
    markRead
}

function query() {
    return httpService.get(BASE_URL)
}

function add(secondUserID) {
    return httpService.post(BASE_URL, { secondUserID })
}

function addLine(secondUserID, messageID, lineToSend) {
    return httpService.put(BASE_URL + messageID, { secondUserID, lineToSend })
}

function markRead(messageID) {
    return httpService.put(BASE_URL + 'read/' + messageID)
}
