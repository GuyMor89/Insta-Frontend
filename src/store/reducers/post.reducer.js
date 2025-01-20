export const SET_POSTS = 'SET_POSTS'
export const REMOVE_POST = 'REMOVE_POST'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const SET_IS_LOADING = 'IS_LOADING'
export const SET_USER_MODAL_DATA = 'SET_USER_MODAL_DATA'
export const SET_HOVERING_OVER_MODAL = 'SET_HOVERING_OVER_MODAL'
export const SET_CREATE_MODAL = 'SET_CREATE_MODAL'
export const SET_POST_MODAL = 'SET_POST_MODAL'
export const SET_DIALOGUE_MODAL = 'SET_DIALOGUE_MODAL'

const initialState = {
    posts: [],
    userModalData: {},
    hoveringOverModal: false,
    createModal: { open: false },
    postModal: { open: false },
    dialogueModal: { open: false },
    isLoading: false
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
        case SET_USER_MODAL_DATA:
            return {
                ...state,
                userModalData: { ...action.userModalData }
            }
        case SET_HOVERING_OVER_MODAL:
            return {
                ...state,
                hoveringOverModal: action.hoveringOverModal 
            }
        case SET_CREATE_MODAL:
            return {
                ...state,
                createModal: { ...action.createModal }
            }
        case SET_POST_MODAL:
            return {
                ...state,
                postModal: { ...action.postModal }
            }
        case SET_DIALOGUE_MODAL:
            return {
                ...state,
                dialogueModal: { ...action.dialogueModal }
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
