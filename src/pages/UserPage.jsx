import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"

import { postActions } from "../store/actions/post.actions.js"
import { userActions } from "../store/actions/user.actions.js"
import { userService } from "../services/user.service.js"
import { interactionService } from "../services/interactions.service.js"
import { uploadService } from "../services/upload.service"
import { hookService } from "../services/hook.service.js"
import { messageService } from "../services/message.service.js"

export function UserPage() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const posts = useSelector(storeState => storeState.postModule.posts)

    const [uploadedImage, setUploadedImage] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const [currUser, setCurrUser] = useState(null)
    const [currPage, setCurrPage] = useState('posts')

    const { location, params, navigate } = hookService()

    const imageInput = useRef(null)

    useEffect(() => {
        // if (!fullLoggedInUser) userActions.loadLoggedInUser()
        getUser()
    }, [params.username, fullLoggedInUser, posts])

    async function getUser() {
        const user = await userService.getByUsername(params.username)
        setCurrUser(user)
    }

    function handleButtons() {
        if (myUserPage) return (<div className="follow-btn grey"  onClick={() => postActions.openModal('switch')}>Switch User</div>)
        if (!myUserPage && !alreadyFollowingUser) return (<><div className="follow-btn" onClick={() => interactionService.followUser(currUser._id)}>Follow</div><button className="message-btn" onClick={() => startMessage()}>Message</button></>)
        if (!myUserPage && alreadyFollowingUser) return (<><div className="follow-btn grey" onClick={() => postActions.openModal('menu', currUser._id)}>Following <span><svg fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12" style={{ transform: 'rotate(180deg)' }}><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"></path></svg></span></div><button className="message-btn" onClick={() => startMessage()}>Message</button></>)
    }

    async function startMessage() {
        const newMessageID = await messageService.add(currUser._id)
        navigate(`/direct/t/${newMessageID}`)
    }

    async function uploadImg(ev) {
        ev.preventDefault()
        setIsUploading(true)

        const { secure_url } = await uploadService.uploadImg(ev)
        setUploadedImage(secure_url)
        ev.target.value = ''
        userActions.updateUser({ ...fullLoggedInUser, imgUrl: secure_url })

        setIsUploading(false)
    }

    if (!currUser || !fullLoggedInUser) return

    const myUserPage = fullLoggedInUser._id === currUser._id
    const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === currUser._id)

    return (
        <article className="user-page-container">
            <div className="user-page-header-container">
                <div className="user-image" onClick={() => imageInput.current.click()}>
                    {isUploading
                        ? <img className='loader' src='https://res.cloudinary.com/dtkjyqiap/image/upload/v1737145287/ShFi4iY4Fd9_aww4yy.gif'></img>
                        : <img src={uploadedImage ? uploadedImage : currUser.imgUrl} />}
                    <input
                        ref={imageInput}
                        hidden
                        type="file"
                        onChange={uploadImg}
                        accept="img/*"
                    />
                </div>
                <div className="user-page-header">
                    <div className="user-nav">
                        <div className="user-name">{currUser.username}</div>
                        {handleButtons()}
                    </div>
                    <div className="user-data">
                        <div className="user-posts">
                            <span>{currUser.imgUrls.length}</span>
                            posts
                        </div>
                        <div className="user-followers">
                            <span>{currUser.followers.length}</span>
                            followers
                        </div>
                        <div className="user-following">
                            <span>{currUser.following.length}</span>
                            following
                        </div>
                    </div>
                    <div className="user-description">
                        <div className="full-name">{currUser.fullname}</div>
                        <div className="user-bio">{currUser.bio || ''}</div>
                        <div className="followed-by"><span></span></div>
                    </div>
                </div>
            </div>

            <div className="user-content-container">
                <div className="user-content-header">
                    <div className={`user-posts-btn ${currPage === 'posts' && 'chosen'}`} onClick={() => setCurrPage('posts')}>
                        <svg fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><rect fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
                        <span>POSTS</span>
                    </div>
                    <div className={`user-saved-btn ${currPage === 'saved' && 'chosen'}`} onClick={() => setCurrPage('saved')}>
                        <svg fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                        <span>SAVED</span>
                    </div>
                </div>
                {currPage === 'posts'
                    ? < div className="user-posts-container">
                        {currUser.imgUrls.length > 0
                            ? currUser.imgUrls.map(image =>
                                <div className="user-post" onClick={() => navigate(`/p/${image._id}`, { state: { previousLocation: location.pathname } })}>
                                    <img src={image.url} />
                                </div>
                            )
                            : <div className="no-posts">
                                <svg fill="currentColor" height="62" role="img" viewBox="0 0 96 96" width="62"><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></circle><ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" stroke-linejoin="round" stroke-width="2.095"></ellipse><path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
                                <div className="no-posts-title">{myUserPage ? 'Share Photos' : 'No Posts Yet'}</div>
                                {myUserPage &&
                                    <>
                                        <div className="no-posts-body">When you share photos, they will appear on your profile.</div>
                                        <button className="share-post-link" onClick={() => postActions.openModal('create')}>Share your first photo</button>
                                    </>
                                }
                            </div>}
                    </div>
                    : < div className="user-posts-container">
                        {currUser.savedImgUrls.length > 0
                            ? currUser.savedImgUrls.map(image =>
                                <div className="user-post" onClick={() => navigate(`/p/${image._id}`, { state: { previousLocation: location.pathname } })}>
                                    <img src={image.url} />
                                </div>
                            )
                            : <div className="no-posts">
                                <svg fill="currentColor" height="62" role="img" viewBox="0 0 96 96" width="62"><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></circle><ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" stroke-linejoin="round" stroke-width="2.095"></ellipse><path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
                                <div className="no-posts-title">{myUserPage ? 'Share Photos' : 'No Posts Yet'}</div>
                                {myUserPage &&
                                    <>
                                        <div className="no-posts-body">When you share photos, they will appear on your profile.</div>
                                        <button className="share-post-link" onClick={() => postActions.openModal('create')}>Share your first photo</button>
                                    </>
                                }
                            </div>}
                    </div>
                }
            </div>
        </article >
    )
}