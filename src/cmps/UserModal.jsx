import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { SET_USER_MODAL_DATA } from "../store/reducers/post.reducer.js"
import { interactionService } from "../services/interactions.service.js"
import { hookService } from '../services/hook.service.js'
import { userService } from "../services/user.service.js"

export function UserModal() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const modalOpen = useSelector(storeState => storeState.postModule.userModalData.open)

    const userModalData = useSelector(storeState => storeState.postModule.userModalData)
    const currentCoords = useSelector(storeState => storeState.postModule.userModalData.coords)
    const username = useSelector(storeState => storeState.postModule.userModalData.username)

    const [isHovering, setIsHovering] = useState(false)
    const [currUser, setCurrUser] = useState(null)

    const { location, dispatch, navigate } = hookService()

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    useEffect(() => {
        if (currUser?.username !== username) getUser()
    }, [username])

    async function getUser() {
        const user = await userService.getByUsernameWithPosts(username)
        setCurrUser(user)
    }

    useEffect(() => {
        dispatch({
            type: SET_USER_MODAL_DATA,
            userModalData: {
                ...userModalData,
                open: false,
                coords: { x: -2000, y: 0 }
            },
        })
    }, [location])

    if (!currUser || !fullLoggedInUser) return

    const myUserPage = fullLoggedInUser._id === currUser._id
    const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === currUser._id)

    function handleFollowBtn() {
        if (myUserPage) return (<button className="grey"><div className="follow-btn"><span>Edit profile</span></div></button>)
        if (!myUserPage && !alreadyFollowingUser) return (<button onClick={() => interactionService.followUser(currUser._id)}><div className="follow-btn"><svg fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20"><title></title><path d="M19.006 8.252a3.5 3.5 0 1 1-3.499-3.5 3.5 3.5 0 0 1 3.5 3.5Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></path><path d="M22 19.5v-.447a4.05 4.05 0 0 0-4.05-4.049h-4.906a4.05 4.05 0 0 0-4.049 4.049v.447" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" x1="5.001" x2="5.001" y1="7.998" y2="14.003"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" x1="8.004" x2="2.003" y1="11" y2="11"></line></svg><span>Follow</span></div></button>)
        if (!myUserPage && alreadyFollowingUser) return (<button className="grey" onClick={() => interactionService.unfollowUser(currUser._id)}><div className="follow-btn"><svg fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20"><title></title><path d="M19.006 8.252a3.5 3.5 0 1 1-3.499-3.5 3.5 3.5 0 0 1 3.5 3.5Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></path><path d="M22 19.5v-.447a4.05 4.05 0 0 0-4.05-4.049h-4.906a4.05 4.05 0 0 0-4.049 4.049v.447" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" x1="5.001" x2="5.001" y1="7.998" y2="14.003"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" x1="8.004" x2="2.003" y1="11" y2="11"></line></svg><span>Unfollow</span></div></button>)
    }

    return (
        <div className='user-modal' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{
            '--modal-left': `${currentCoords?.x}px`,
            top: currentCoords?.y, // or `${currentCoords?.y}px` if it's a number and you need units
            opacity: modalOpen || isHovering ? 1 : 0,
            visibility: modalOpen || isHovering ? 'visible' : 'hidden',
            pointerEvents: modalOpen || isHovering ? 'all' : 'none'
        }}
            onClick={(e) => { e.stopPropagation() }}>
            <div className="user-details">
                <div className="user-image" onClick={() => { navigate(`/${currUser.username}`); setIsHovering(false) }}>
                    <img src={currUser.imgUrl} />
                </div>
                <div className="header-details-container">
                    <div className="header-details">
                        <div className="user-name" onClick={() => { navigate(`/${currUser.username}`); setIsHovering(false) }}>{currUser.username}</div>
                    </div>
                    <div className="full-name">{currUser.fullname}</div>
                </div>
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
            <div className="user-posts-container">
                {currUser.imgUrls.length > 0
                    ? currUser.imgUrls.map((image, idx) => {
                        if (idx < 3) return (
                            <div className="user-post" onClick={() => { navigate(`/p/${image._id}`, { state: { previousLocation: location.pathname } }); setIsHovering(false) }}>
                                <img src={image.url} />
                            </div>
                        )
                    }
                    )
                    : <div className="no-posts">
                        <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1737130872/0qSQcHrCNzw_huro0j.png"></img>
                        <div className="no-posts-title">No posts yet</div>
                        <div className="no-posts-body">When {currUser.username} shares photos and reels, you'll see them here.</div>
                    </div>}
            </div>
            {handleFollowBtn()}
        </div>
    )
}