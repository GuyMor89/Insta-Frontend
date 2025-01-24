export const SET_FULL_LOGGEDIN_USER = 'SET_FULL_LOGGEDIN_USER'
export const SET_USERS = 'SET_USERS'
export const REMOVE_USER = 'REMOVE_USER'
export const UPDATE_USER = 'UPDATE_USER'

const initialState = {
    users: [],
    fullLoggedInUser: null
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
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userID)
            }

        default:
            return state
    }
}
