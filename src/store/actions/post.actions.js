import { postService } from "../../services/post.service.js"
import { SET_POSTS, UPDATE_POST, ADD_POST, REMOVE_POST, SET_IS_LOADING, SET_MODAL_STATE} from "../reducers/post.reducer.js"
import { store } from "../store.js"

export const postActions = {
    loadPosts,
    savePost,
    removePost,
    openModal,
    closeModal
}

async function loadPosts(postLimit) {
    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        const posts = await postService.query(postLimit)
        store.dispatch({ type: SET_POSTS, posts })
        return posts
    } catch (err) {
        console.log('Post action -> Cannot load Posts', err)
        throw err
    }
    finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

async function removePost(postId) {
    try {
        await postService.remove(postId)
        store.dispatch({ type: REMOVE_POST, postId })
    } catch (err) {
        console.log('Post action -> Cannot remove Post', err)
        throw err
    }
}

async function savePost(post) {
    const type = post._id ? UPDATE_POST : ADD_POST

    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        const savedPost = await postService.save(post)
        console.log(savedPost)
        store.dispatch({ type, post: savedPost })
        return savedPost
    } catch (err) {
        console.log('Post action -> Cannot save Post', err)
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

async function openModal(type, data) {
    console.log(type)
    if (type === 'post') store.dispatch({ type: SET_MODAL_STATE, postModal: { open: true } })
    if (type === 'create') store.dispatch({ type: SET_MODAL_STATE, createModal: { open: true } })
    if (type === 'dialogue') store.dispatch({ type: SET_MODAL_STATE, dialogueModal: { open: true } })
    if (type === 'menu') store.dispatch({ type: SET_MODAL_STATE, menuModal: { open: true, data} })
}

async function closeModal(type) {
    if (type === 'post') store.dispatch({ type: SET_MODAL_STATE, postModal: { open: false } })
    if (type === 'create') store.dispatch({ type: SET_MODAL_STATE, createModal: { open: false } })
    if (type === 'dialogue') store.dispatch({ type: SET_MODAL_STATE, dialogueModal: { open: false } })
    if (type === 'menu') store.dispatch({ type: SET_MODAL_STATE, menuModal: { open: false, data: null } })
}
