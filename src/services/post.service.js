import { httpService } from "./http.service.js"

const BASE_URL = 'posts/'

export const postService = {
    query,
    getById,
    save,
    remove,
}

function query(filterBy) {
    return httpService.get(BASE_URL, filterBy)
}

function getById(postID) {
    return httpService.get(BASE_URL + postID)
}

function remove(postID) {
    return httpService.delete(BASE_URL + postID)
}

function save(post) {
    if (post._id) {
        return httpService.put(BASE_URL + post._id, post)
    } else {
        return httpService.post(BASE_URL, post)
    }
}
