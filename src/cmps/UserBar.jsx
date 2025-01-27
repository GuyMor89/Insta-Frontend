import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { HoverTracker } from "./HoverTracker.jsx"

import { interactionService } from "../services/interactions.service.js"
import { postActions } from "../store/actions/post.actions.js"

export function UserBar() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const usersIAmNotFollowing = useSelector(storeState => storeState.userModule.users.filter(user => user._id !== fullLoggedInUser?._id && !fullLoggedInUser?.following.find(_id => _id === user._id)))
    const [suggestedUsers, setSuggestedUsers] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (!suggestedUsers || suggestedUsers?.length === 0) setSuggestedUsers(usersIAmNotFollowing)
    }, [usersIAmNotFollowing])

    function handleFollowBtn(userID) {
        const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === userID)
        const myUser = fullLoggedInUser._id === userID
        if (!myUser && !alreadyFollowingUser) return <div className="follow-btn" onClick={() => interactionService.followUser(userID)}>Follow</div>
        if (!myUser && alreadyFollowingUser) return <div className="follow-btn following" onClick={() => interactionService.unfollowUser(userID)}>Following</div>
    }

    if (!fullLoggedInUser ) return

    return (
        <article className="user-bar-container">
            <div className="loggedIn-user-details">
                <div className="user-image" onClick={() => navigate(`/${fullLoggedInUser.username}`)}>
                    <img src={fullLoggedInUser.imgUrl} />
                </div>
                <div className="header-details-container">
                    <div className="header-details">
                        <div className="user-name" onClick={() => navigate(`/${fullLoggedInUser.username}`)}>{fullLoggedInUser.username}</div>
                    </div>
                    <div className="location">{fullLoggedInUser.fullname}</div>
                </div>
                <div className="menu" onClick={() => postActions.openModal('switch')}>Switch</div>
            </div>
            <div className="suggested">Suggested for you</div>

            {suggestedUsers?.map(user =>
                <div className="suggested-user-details">
                    <HoverTracker username={user.username}>
                        <div className="user-image" onClick={() => navigate(`/${user.username}`)}>
                            <img src={user.imgUrl} />
                        </div>
                    </HoverTracker>
                    <div className="header-details-container">
                        <div className="header-details">
                            <HoverTracker username={user.username}>
                                <div className="user-name" onClick={() => navigate(`/${user.username}`)}>{user.username}</div>
                            </HoverTracker>
                        </div>
                        <div className="location">{user.fullname}</div>
                    </div>
                    {handleFollowBtn(user._id)}
                </div>
            )}
        </article>
    )
}