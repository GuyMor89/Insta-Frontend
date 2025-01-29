import { httpService } from "./http.service.js"

const BASE_URL = 'messages/'

export const messageService = {
    query,
    update
}

function query() {
    return httpService.get(BASE_URL)
}

function update(messageID, lineToSend) {
    return httpService.put(BASE_URL + messageID, { lineToSend })
}
