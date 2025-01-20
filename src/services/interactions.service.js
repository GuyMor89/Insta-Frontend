import { postActions } from "../store/actions/post.actions.js";
import { userActions } from "../store/actions/user.actions.js";
import { utilService } from "./util.service.js";

export const interactionService = {
    likePost,
    unlikePost,
    followUser,
    unfollowUser,
    addCommentToPost
}

// Post

function likePost(post, fullLoggedInUser) {
    postActions.savePost({ ...post, likedBy: [...post.likedBy, fullLoggedInUser._id] })
}

function unlikePost(post, fullLoggedInUser) {
    postActions.savePost({ ...post, likedBy: post.likedBy.filter(_id => _id !== fullLoggedInUser._id) })
}

function addCommentToPost(post, fullLoggedInUser, comment, commentInput, setComment) {
    const commentToAdd = { _id: utilService.makeId(), createdAt: new Date(), by: { _id: fullLoggedInUser._id, imgUrl: fullLoggedInUser.imgUrl, username: fullLoggedInUser.username }, text: comment }

    postActions.savePost({ ...post, comments: [...post.comments, commentToAdd] })

    commentInput.current.value = ''
    setComment(null)
}

// User

function followUser(postOwnerID, fullLoggedInUser) {
    userActions.updateUser({ ...fullLoggedInUser, following: [...fullLoggedInUser.following, postOwnerID] })
}

function unfollowUser(postOwnerID, fullLoggedInUser) {
    userActions.updateUser({ ...fullLoggedInUser, following: fullLoggedInUser.following.filter(_id => _id !== postOwnerID) })
}
