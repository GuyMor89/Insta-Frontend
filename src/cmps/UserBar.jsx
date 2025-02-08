import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { HoverTracker } from "./HoverTracker.jsx"

import { interactionService } from "../services/interactions.service.js"
import { postActions } from "../store/actions/post.actions.js"
import { userActions } from "../store/actions/user.actions.js"
import { hookService } from "../services/hook.service.js"

export function UserBar() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const allUsers = useSelector(storeState => storeState.userModule.users)
    const [usersIAmNotFollowing, setUsersIAmNotFollowing] = useState(null)
    const [suggestedUsers, setSuggestedUsers] = useState(null)

    const { navigate, location } = hookService()

    useEffect(() => {
        postActions.setIsLoading(true)

        userActions.loadUsers()

        setTimeout(() => {
            postActions.setIsLoading(false)
        }, 200)

    }, [])

    useEffect(() => {
        const usersIAmFollowing = allUsers.filter(user =>
            user._id !== fullLoggedInUser?._id &&
            fullLoggedInUser?.following.includes(user._id)
        )

        const usersTheyAreFollowing = allUsers.filter(user =>
            usersIAmFollowing.some(followingUser => followingUser.following.includes(user._id)) &&
            user._id !== fullLoggedInUser?._id && // Exclude logged-in user
            !usersIAmFollowing.some(followedUser => followedUser._id === user._id) // Exclude already followed users
        )

        setUsersIAmNotFollowing(usersTheyAreFollowing)
    }, [fullLoggedInUser])

    useEffect(() => {
        if (!suggestedUsers || suggestedUsers.length === 0) setSuggestedUsers(usersIAmNotFollowing?.slice(0, 5))
    }, [usersIAmNotFollowing])

    useEffect(() => {
        setSuggestedUsers(null)
    }, [fullLoggedInUser?.username])

    function handleFollowBtn(userID) {
        const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === userID)
        const myUser = fullLoggedInUser._id === userID
        if (!myUser && !alreadyFollowingUser) return <div className="follow-btn" onClick={() => interactionService.followUser(userID)}>Follow</div>
        if (!myUser && alreadyFollowingUser) return <div className="follow-btn following" onClick={() => interactionService.unfollowUser(userID)}>Following</div>
    }

    if (!fullLoggedInUser || !suggestedUsers) return
    console.log(suggestedUsers)

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

            {suggestedUsers?.length > 0
                ? suggestedUsers?.map(user =>
                    <div className="suggested-user-details">
                        <HoverTracker username={user.username}>
                            <div className="user-image" onClick={() => navigate(`/${user.username}`)}>
                                <img src={user.imgUrl} />
                            </div>
                        </HoverTracker>
                        <div className="header-details-container">
                            <div className="header-details">
                                <div className="user-name" onClick={() => navigate(`/${user.username}`)}>{user.username}</div>
                            </div>
                            <div className="location">{user.fullname}</div>
                        </div>
                        {handleFollowBtn(user._id)}
                    </div>
                )
                : <div className="no-suggested-users">
                    <span>Follow users</span>
                    <span> to get suggestions</span>
                </div>
            }
        </article>
    )
}