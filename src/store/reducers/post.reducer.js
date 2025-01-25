export const SET_POSTS = 'SET_POSTS'
export const REMOVE_POST = 'REMOVE_POST'
export const ADD_POST = 'ADD_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const SET_IS_LOADING = 'IS_LOADING'
export const SET_PREV_LOC = 'SET_PREV_LOC'
export const SET_USER_MODAL_DATA = 'SET_USER_MODAL_DATA'
export const SET_MODAL_STATE = 'SET_MODAL_STATE'
export const SET_CREATE_MODAL = 'SET_CREATE_MODAL'
export const SET_POST_MODAL = 'SET_POST_MODAL'
export const SET_DIALOGUE_MODAL = 'SET_DIALOGUE_MODAL'
export const SET_MENU_MODAL = 'SET_MENU_MODAL'

const initialState = {
    posts: [],
    userModalData: {},
    isLoading: false,
    prevLoc: '',
    modals: {
        createModal: { open: false },
        postModal: { open: false },
        dialogueModal: { open: false },
        menuModal: { open: false },
    }

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
                posts: [action.post, ...state.posts]
            }
        case UPDATE_POST:
            return {
                ...state,
                posts: state.posts.map(post => post._id === action.post._id ? action.post : post)
            }
        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case SET_PREV_LOC:
            return {
                ...state,
                prevLoc: action.prevLoc
            }
        case SET_USER_MODAL_DATA:
            return {
                ...state,
                userModalData: { ...action.userModalData }
            }
        case SET_MODAL_STATE:
            const modalName = Object.keys(action).find(key => key !== 'type')
            return {
                ...state,
                modals: {
                    ...state.modals, [modalName]: { ...state.modals[modalName], ...action[modalName] }
                }
            }
        default:
            return state
    }
}
