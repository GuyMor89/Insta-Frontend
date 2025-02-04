export const SET_FULL_LOGGEDIN_USER = 'SET_FULL_LOGGEDIN_USER'
export const SET_USERS = 'SET_USERS'
export const UPDATE_USER = 'UPDATE_USER'
export const SET_MESSAGES = 'SET_MESSAGES'
export const SET_NEW_NOTIFICATIONS = 'SET_NEW_NOTIFICATIONS'

const initialState = {
    users: [],
    fullLoggedInUser: null,
    messages: [],
    newNotifications: { message: false, other: false }
}

export function userReducer(state = initialState, action) {
    switch (action.type) {

        case SET_FULL_LOGGEDIN_USER:
            return {
                ...state,
                fullLoggedInUser: action.fullLoggedInUser
            }
        case SET_USERS:
            return {
                ...state,
                users: action.users
            }
        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => user._id === action.user._id ? action.user : user),
                fullLoggedInUser: (action.user._id === state.fullLoggedInUser._id) ? action.user : state.fullLoggedInUser
            }
        case SET_MESSAGES:
            return {
                ...state,
                messages: action.messages
            }
        case SET_NEW_NOTIFICATIONS:
            return {
                ...state,
                newNotifications: action.newNotifications
            }


        default:
            return state
    }
}
