import { postActions } from "../store/actions/post.actions.js";
import { userActions } from "../store/actions/user.actions.js";
import { notificationService } from "./notifications.service.js";
import { socketService } from "./socket.service.js";
import { utilService } from "./util.service.js";

export const interactionService = {
    likePost,
    unlikePost,
    followUser,
    unfollowUser,
    addCommentToPost,
    savePost,
    unSavePost
}

// Post

async function likePost(post, fullLoggedInUser) {
    await postActions.savePost({ ...post, likedBy: [...post.likedBy, fullLoggedInUser._id] })
    notificationService.addActivity(post.by._id, { type: 'post', action: 'like', imgUrl: post.imgUrl, _id: post._id })
}

function unlikePost(post, fullLoggedInUser) {
    postActions.savePost({ ...post, likedBy: post.likedBy.filter(_id => _id !== fullLoggedInUser._id) })
}

async function addCommentToPost(post, fullLoggedInUser, comment, commentInput, setComment) {
    const commentToAdd = { _id: utilService.makeId(), createdAt: Date.now(), by: { _id: fullLoggedInUser._id, imgUrl: fullLoggedInUser.imgUrl, username: fullLoggedInUser.username }, text: comment }

    commentInput.current.value = ''
    setComment(null)

    await postActions.savePost({ ...post, comments: [...post.comments, commentToAdd] })
    notificationService.addActivity(post.by._id, { type: 'post', action: 'comment', imgUrl: post.imgUrl, _id: post._id })
}

// User

async function followUser(userToFollowID) {
    console.log('following')
    const type = 'follow'

    await userActions.updateUsers(type, userToFollowID)
    notificationService.addActivity(userToFollowID, { action: 'follow' })
}

function unfollowUser(userToFollowID,) {
    console.log('unfollowing')
    const type = 'unfollow'
    userActions.updateUsers(type, userToFollowID)
}

function savePost(post, fullLoggedInUser) {
    console.log('saving')
    const userAlreadySavedPost = fullLoggedInUser.savedPostIDs.some(_id => _id === post._id)
    if (userAlreadySavedPost) return

    userActions.updateUser({ ...fullLoggedInUser, savedPostIDs: [...fullLoggedInUser.savedPostIDs, post._id] })
    notificationService.addActivity(post.by._id, { type: 'post', action: 'save', imgUrl: post.imgUrl, _id: post._id })
}

function unSavePost(post, fullLoggedInUser) {
    console.log('unsaving')
    const userHasNotSavedPost = fullLoggedInUser.savedPostIDs.find(_id => _id === post._id)
    if (!userHasNotSavedPost) return
    userActions.updateUser({ ...fullLoggedInUser, savedPostIDs: fullLoggedInUser.savedPostIDs.filter(_id => _id !== post._id) })
}

