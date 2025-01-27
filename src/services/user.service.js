import { httpService } from "./http.service.js"

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = 'users/'

export const userService = {
    getUsers,
    getById,
    getByUsername,
    login,
    signup,
    logout,
    getLoggedinUser,
    remove,
    update,
    updateUsers
}

function getUsers(text) {
    return httpService.get('users', {text: text})
}

function getById(userId) {
    return httpService.get(BASE_URL + 'id/' + userId)
}

function getByUsername(username) {
    return httpService.get(BASE_URL + 'username/' + username)
}

async function login({ username, password }) {
    try {
        const user = await httpService.post('auth/login', { username, password })
        const savedUser = _setLoggedinUser(user)
        return savedUser
    } catch (err) {
        console.log(err)
    }
}

async function signup({ username, password, fullname }) {
    try {
        const user = await httpService.post('auth/signup', { username, password, fullname })
        _setLoggedinUser(user)
        return user
    } catch (err) {
        console.log(err)
    }
}

async function logout() {
    await httpService.post('auth/logout')
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
    // return httpService.get('auth/verify')
}

function remove(userId) {
    return httpService.delete('users/' + userId)
}

async function update(userToUpdate) {
    try {
        const user = await httpService.put('users/', userToUpdate)
        const loggedInUser = getLoggedinUser()
        if (user._id === loggedInUser._id) _setLoggedinUser(user)
        return user
    } catch (err) {
        console.log(err)
    }
}

async function updateUsers(type, userToFollowID) {
    try {
        const users = await httpService.put(BASE_URL + userToFollowID, {type})
        return users
    } catch (err) {
        console.log(err)
    }
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, username: user.username, fullname: user.fullname, imgUrl: user.imgUrl }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}
