import { userService } from '../../services/user.service.js'
import { REMOVE_USER, SET_LOGGEDIN_USER, SET_USERS, UPDATE_USER } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export const userActions = {
    loadLoggedInUser,
    loadUsers,
    loginUser,
    logoutUser,
    signupUser,
    updateUser,
    removeUser
}

async function loadLoggedInUser() {
    try {
        const user = await userService.getLoggedinUser()
        if (user) store.dispatch({ type: SET_LOGGEDIN_USER, user })
    } catch (err) {
        console.error('Failed to load logged-in user:', err)
    }
}

async function loadUsers() {
    try {
        const users = await userService.getUsers()
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        console.error('Failed to load user list:', err)
        throw err
    }
}

async function loginUser(credentials) {
    try {
        const user = await userService.login(credentials)
        store.dispatch({ type: SET_LOGGEDIN_USER, user })
    } catch (err) {
        console.error('Failed to load logged-in user:', err)
        throw err
    }
}

async function signupUser(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({ type: SET_LOGGEDIN_USER, user })
    } catch (err) {
        console.error('Failed to signup user:', err)
        throw err
    }
}

async function logoutUser() {
    try {
        await userService.logout()
        store.dispatch({ type: SET_LOGGEDIN_USER, user: null })
    } catch (err) {
        console.error('Failed to logout:', err)
        throw err
    }
}

async function updateUser(userToUpdate) {
    try {
        const user = await userService.update(userToUpdate)
        console.log(user)
        store.dispatch({ type: UPDATE_USER, user })
    } catch (err) {
        console.log('Cannot update user', err)
        throw err
    }
}

async function removeUser(userID) {
    try {
        await userService.remove(userID)
        store.dispatch({ type: REMOVE_USER, userID })
    } catch (err) {
        console.log('Cannot remove user:', err)
        throw err
    }
}