export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'
export const SET_USERS = 'SET_USERS'
export const REMOVE_USER = 'REMOVE_USER'
export const UPDATE_USER = 'UPDATE_USER'

const initialState = {
    users: [],
    loggedInUser: null
}

export function userReducer(state = initialState, action) {
    switch (action.type) {

        case SET_LOGGEDIN_USER:
            return {
                ...state,
                loggedInUser: action.user
            }
        case SET_USERS:
            return {
                ...state,
                users: action.users
            }
        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => user._id === action.user._id ? action.user : user)
            }
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userID)
            }

        default:
            return state
    }
}
