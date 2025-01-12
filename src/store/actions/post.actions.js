import { postService } from "../../services/post.service.js"
import { SET_POSTS, UPDATE_POST, ADD_POST, REMOVE_POST, SET_IS_LOADING } from "../reducers/post.reducer.js"
import { store } from "../store.js"

export const postActions = {
    loadPosts,
    savePost,
    removePost,
}

async function loadPosts(filterBy) {
    try {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
        const posts = await postService.query(filterBy)
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

async function savePost(post, user) {
    const type = post._id ? UPDATE_POST : ADD_POST

    try {
        const savedPost = await postService.save(post, user)
        store.dispatch({ type, post: savedPost })
        return savedPost
    } catch (err) {
        console.log('Post action -> Cannot save Post', err)
        throw err
    }
}
