import { httpService } from "./http.service.js"

const BASE_URL = 'messages/'

export const messageService = {
    query,
    add,
    update
}

function query() {
    return httpService.get(BASE_URL)
}

function add(secondUserID) {
    return httpService.post(BASE_URL, { secondUserID })
}

function update(messageID, lineToSend) {
    return httpService.put(BASE_URL + messageID, { lineToSend })
}
