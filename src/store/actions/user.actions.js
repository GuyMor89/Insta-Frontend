import { notificationService } from '../../services/notifications.service.js'
import { socketService } from '../../services/socket.service.js'
import { userService } from '../../services/user.service.js'
import { SET_FULL_LOGGEDIN_USER, SET_NEW_NOTIFICATIONS, SET_USERS, UPDATE_USER } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export const userActions = {
    loadLoggedInUser,
    loadUsers,
    loginUser,
    logoutUser,
    signupUser,
    updateUser,
    updateUsers,
    setNewNotifications
}

async function loadLoggedInUser() {
    try {
        const loggedInUser = await userService.getLoggedinUser()
        if (!loggedInUser) return undefined

        const fullLoggedInUser = await userService.getById(loggedInUser._id)
        if (fullLoggedInUser) store.dispatch({ type: SET_FULL_LOGGEDIN_USER, fullLoggedInUser })

        return fullLoggedInUser
    } catch (err) {
        console.error('Failed to load logged-in user:', err)
        return undefined
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
        store.dispatch({ type: SET_FULL_LOGGEDIN_USER, user })
        socketService.login()
    } catch (err) {
        console.error('Failed to load logged-in user:', err)
        throw err
    }
}

async function signupUser(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({ type: SET_FULL_LOGGEDIN_USER, user })
    } catch (err) {
        console.error('Failed to signup user:', err)
        throw err
    }
}

async function logoutUser() {
    try {
        await userService.logout()
        store.dispatch({ type: SET_FULL_LOGGEDIN_USER, user: null })
        socketService.logout()
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

async function updateUsers(type, userToFollowID) {
    try {
        const users = await userService.updateUsers(type, userToFollowID)
        console.log(users)

        store.dispatch({ type: UPDATE_USER, user: users.updatedLoggedInUser })
        store.dispatch({ type: UPDATE_USER, user: users.updatedUserToFollow })
    } catch (err) {
        console.log('Cannot update users', err)
        throw err
    }
}

function setNewNotifications(newNotifications) {
    store.dispatch({ type: SET_NEW_NOTIFICATIONS, newNotifications })
}
