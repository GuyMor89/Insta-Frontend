import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { postActions } from "../store/actions/post.actions.js"
import { useLocation, useNavigate } from "react-router-dom"
import { UserModal } from "../cmps/UserModal.jsx"
import { userActions } from "../store/actions/user.actions.js"
import { userService } from "../services/user.service.js"
import { utilService } from "../services/util.service.js"
import { interactionService } from "../services/interactions.service.js"
import { HoverTracker } from "./HoverTracker.jsx"

export function Post({ post, fullLoggedInUser, isLast }) {

    const [comment, setComment] = useState(null)
    const [captionState, setCaptionState] = useState('short')
    const commentInput = useRef(null)

    const location = useLocation()
    const navigate = useNavigate()

    function handleFollowBtn() {
        if (!myPost && !alreadyFollowingUser) return (<> <span>•</span> <div className="follow-btn" onClick={() => interactionService.followUser(fullLoggedInUser, post.by._id)}>Follow</div> </>)
        if (!myPost && alreadyFollowingUser) return (<> <span>•</span> <div className="follow-btn" onClick={() => interactionService.unfollowUser(fullLoggedInUser, post.by._id)}>Unfollow</div> </>)
    }

    function handleCaption() {
        const captionIsLong = post.caption.length > 125
        const splicedCaption = post.caption.slice(0, 125)

        if (captionIsLong && captionIsSpliced) {
            return (<><div className="text">{splicedCaption}</div>
                <div className="expand-caption" onClick={() => setCaptionState('full')}>
                    <span>...</span> more
                </div></>)
        }
        else if (captionIsSpliced) {
            return (<><div className="text">{splicedCaption}</div>
                <div className="expand-caption" onClick={() => setCaptionState('full')}></div></>)
        }
        else if (captionIsFull) return <div className="text">{post.caption}</div>
    }

    const myPost = post.by._id === fullLoggedInUser._id
    const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === post.by._id)

    const postHasLikes = post.likedBy.length > 0
    const userLikesPost = post.likedBy.some(_id => _id === fullLoggedInUser._id)

    const postHasCaption = post.caption
    const captionIsSpliced = captionState === 'short'
    const captionIsFull = captionState === 'full'

    const postHasComments = post.comments.length > 0

    return (
        <div className="post" key={post._id}>
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
                        <span>•</span>
                        <div className="created-at">
                            {utilService.formatDate(post.createdAt).relativeTime}
                        </div>
                        {handleFollowBtn()}
                    </div>
                    <div className="location">{post.loc}</div>
                </div>
                <svg className="menu" height="24" role="img" viewBox="0 0 24 24" width="24"><title>More options</title><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
            </div>
            <div className="main-image">
                <img src={post.imgUrl} />
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
                <div className="save">
                    <svg height="24" role="img" viewBox="0 0 24 24" width="24"><title>Save</title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                </div>
            </div>

            {postHasLikes &&
                <div className="likes">
                    <span>{post.likedBy.length} likes</span>
                </div>}

            <div className="caption-overlay">
                <div className="caption-container">
                    {postHasCaption && <div className="caption">
                        <div className="username" onClick={() => navigate(`/${post.by.username}`)}>
                            {post.by.username}
                        </div>
                        {handleCaption()}
                    </div>}
                </div>
            </div>

            {postHasComments &&
                <div className="open" onClick={() => navigate(`/p/${post._id}`, { state: { previousLocation: location.pathname } })}>
                    {`View all ${post.comments.length} comments`}
                </div>}

            <div className="add-comment-container">
                <input type="text" ref={commentInput} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment.." />
                <button className={comment?.length > 0 && 'full'} onClick={() => interactionService.addCommentToPost(post, fullLoggedInUser, comment, commentInput, setComment)}>Post</button>
            </div>
            {!isLast && <div className='separator'></div>}
        </div>
    )
}