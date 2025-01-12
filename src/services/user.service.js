import { httpService } from "./http.service.js"

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = 'users/'

export const userService = {
    getUsers,
    getById,
    login,
    signup,
    logout,
    getLoggedinUser,
    remove,
    update,
    getEmptyCredentials
}

function getUsers() {
    return httpService.get('users')
}

function getById(userId) {
    return httpService.get(BASE_URL + userId)
}

async function login({ username, password }) {
    try {
        const user = await httpService.post('auth/login', { username, password })
        _setLoggedinUser(user)
        return user
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
        const user = await httpService.put('users/' + userToUpdate._id, userToUpdate)
        const loggedInUser = getLoggedinUser()
        if (user._id === loggedInUser._id) _setLoggedinUser(user)
        return user
    } catch (err) {
        console.log(err)
    }
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, username: user.username, fullname: user.fullname, isAdmin: user.isAdmin, imgURL: user.imgURL }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}
