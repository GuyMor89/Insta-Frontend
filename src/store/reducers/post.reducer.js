export const SET_POSTS = 'SET_POSTS'
export const REMOVE_POST = 'REMOVE_POST'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const SET_MODAL = 'SET_MODAL'
export const SET_IS_LOADING = 'IS_LOADING'

const initialState = {
    posts: [],
    modal: { open: false },
    // isLoading: false,
}

export function postReducer(state = initialState, action) {
    switch (action.type) {

        case SET_POSTS:
            return { ...state, posts: action.posts }

        case REMOVE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== action.postId)
            }
        case ADD_POST:
            return {
                ...state,
                posts: [...state.posts, action.post]
            }
        case UPDATE_POST:
            return {
                ...state,
                posts: state.posts.map(post => post._id === action.post._id ? action.post : post)
            }
        case SET_MODAL:
            return {
                ...state,
                modal: { ...action.modal }
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }

        default:
            return state
    }
}
