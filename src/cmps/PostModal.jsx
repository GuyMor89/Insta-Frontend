import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { RemoveScroll } from 'react-remove-scroll';
import { HoverTracker } from "./HoverTracker.jsx";

import { postActions } from "../store/actions/post.actions.js"
import { utilService } from '../services/util.service.js'
import { interactionService } from "../services/interactions.service.js";
import { hookService } from "../services/hook.service.js";
import { postService } from "../services/post.service.js";

export function PostModal() {
    
    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const prevLoc = useSelector(storeState => storeState.postModule.prevLoc)
    const [post, setPost] = useState(null)

    const [comment, setComment] = useState(null)
    const commentInput = useRef(null)

    const { navigate, params } = hookService()

    useEffect(() => {
        getPost()
        postActions.openModal('post')
    }, [params.id])

    async function getPost() {
        const post = await postService.getById(params.id)
        setPost(post)
    }

    function closeModal() {
        postActions.closeModal('post')
        navigate(prevLoc)
    }

    if (!post || fullLoggedInUser === null) return

    const userLikesPost = post.likedBy.some(_id => _id === fullLoggedInUser._id)
    const userSavedPost = fullLoggedInUser.savedPostIDs.some(_id => _id === post._id)

    const postHasLikes = post.likedBy.length > 0
    const postHasCaption = post.caption
    const postHasCommentsOrCaption = (post.comments.length > 0 || post.caption !== '')

    return (
        <RemoveScroll>
            <div className='post-modal-overlay' onClick={closeModal}>
                <div className='modal-container' onClick={(e) => e.stopPropagation()} >
                    <div className="close-btn" onClick={() => closeModal()}><svg fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Close</title><polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></polyline><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line></svg></div>
                    <div className='modal'>
                        <div className="post-container">
                            <div className="post-image">
                                <img src={post?.imgUrl}></img>
                            </div>
                            <div className="post-details">

                                <div className="user-details">
                                    <HoverTracker username={post.by.username}>
                                        <div className="user-image" onClick={() => navigate(`/${post.by.username}`)}>
                                            <img src={post.by.imgUrl} />
                                        </div>
                                    </HoverTracker>
                                    <div className="header-details-container">
                                        <div className="header-details">
                                            <HoverTracker username={post.by.username}>
                                                <div className="user-name" onClick={() => navigate(`/${post.by.username}`)}>{post.by.username}</div>
                                            </HoverTracker>
                                        </div>
                                        <div className="location">{post.loc}</div>
                                    </div>
                                    <svg className="menu" height="24" role="img" viewBox="0 0 24 24" width="24"><title>More options</title><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
                                </div>

                                <div className="post-body">

                                    {postHasCaption
                                        && <div className="post-caption-container">
                                            <HoverTracker username={post.by.username}>
                                                <div className="user-image" onClick={() => navigate(`/${post.by.username}`)}>
                                                    <img src={post.by.imgUrl} />
                                                </div>
                                            </HoverTracker>
                                            <div className="header-details-container">
                                                <div className="header-details">
                                                    <HoverTracker username={post.by.username}>
                                                        <div className="user-name" onClick={() => navigate(`/${post.by.username}`)}>{post.by.username}</div>
                                                    </HoverTracker>
                                                </div>
                                                <div className="caption">
                                                    {`${post.caption}`}
                                                </div>
                                            </div>
                                        </div>}

                                    {postHasCommentsOrCaption
                                        ? post.comments.map(comment =>
                                            <div className="comment-container">
                                                <HoverTracker username={comment.by.username}>
                                                    <div className="user-image" onClick={() => navigate(`/${comment.by.username}`)}>
                                                        <img src={comment.by.imgUrl} />
                                                    </div>
                                                </HoverTracker>
                                                <div className="header-details-container">
                                                    <div className="header-details">
                                                        <HoverTracker username={comment.by.username}>
                                                            <div className="user-name" onClick={() => navigate(`/${comment.by.username}`)}>{comment.by.username}</div>
                                                        </HoverTracker>
                                                        <div className="comment">{comment.text}</div>
                                                    </div>
                                                    <div className="comment-content">
                                                        <div className="created-at">{utilService.formatDate(comment.createdAt).relativeTime}</div>
                                                        {comment?.likedBy?.length > 0 && <div className="likes">{comment.likedBy.length} Likes</div>}
                                                    </div>
                                                </div>
                                                {/* <svg fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg> */}
                                            </div>
                                        )
                                        : <div className="no-comments">
                                            <div className="title">No comments yet.</div>
                                            <div className="body">Start the conversation</div>
                                        </div>}

                                </div>

                                <div className="buttons">
                                    <div className="like" onClick={() => userLikesPost ? interactionService.unlikePost(post, fullLoggedInUser) : interactionService.likePost(post, fullLoggedInUser)}>
                                        {userLikesPost
                                            ? <svg fill="red" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Unlike</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                                            : <svg height="24" role="img" viewBox="0 0 24 24" width="24"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>
                                        }
                                    </div>
                                    <div className="comment" onClick={() => commentInput.current.focus()}>
                                        <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Comment</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
                                    </div>
                                    <div className="share">
                                        <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Share Post</title><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                                    </div>
                                    <div className="save" onClick={() => userSavedPost ? interactionService.unSavePost(post, fullLoggedInUser) : interactionService.savePost(post, fullLoggedInUser)}>
                                        {userSavedPost
                                            ? <svg aria-label="Remove" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Remove</title><path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path></svg>
                                            : <svg height="24" role="img" viewBox="0 0 24 24" width="24"><title>Save</title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>}
                                    </div>
                                </div>
                                {postHasLikes
                                    ? <div className="likes">
                                        <span>{post.likedBy.length} likes</span>
                                    </div>
                                    : <div className="no-likes">Be the first to
                                        <span> like this</span>
                                    </div>
                                }

                                <div className="created-at">
                                    {utilService.formatDate(post.createdAt).relativeTime}
                                </div>

                                <div className="add-comment-container">
                                    <input type="text" ref={commentInput} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment.." />
                                    <button className={comment?.length > 0 && 'full'} onClick={() => interactionService.addCommentToPost(post, fullLoggedInUser, comment, commentInput, setComment)}>Post</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RemoveScroll>
    )
}