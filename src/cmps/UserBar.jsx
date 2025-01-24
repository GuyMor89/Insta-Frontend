import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { HoverTracker } from "./HoverTracker"
import { interactionService } from "../services/interactions.service"
import { userActions } from "../store/actions/user.actions"

export function UserBar() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const suggestedUsers = useSelector(storeState => storeState.userModule.users.filter(user => user._id !== fullLoggedInUser?._id))

    const navigate = useNavigate()

    function handleFollowBtn(userID) {
        const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === userID)
        const myUser = fullLoggedInUser._id === userID
        if (!myUser && !alreadyFollowingUser) return <div className="follow-btn" onClick={() => interactionService.followUser(userID)}>Follow</div>
        if (!myUser && alreadyFollowingUser) return <div className="follow-btn" onClick={() => interactionService.unfollowUser(userID)}>Unfollow</div>
    }

    if (!fullLoggedInUser) return

    return (
        <article className="user-bar-container">
            <div className="loggedInUser-details">
                <div className="user-image" onClick={() => navigate(`/${fullLoggedInUser.username}`)}>
                    <img src={fullLoggedInUser.imgUrl} />
                </div>
                <div className="header-details-container">
                    <div className="header-details">
                        <div className="user-name" onClick={() => navigate(`/${fullLoggedInUser.username}`)}>{fullLoggedInUser.username}</div>
                    </div>
                    <div className="location">{fullLoggedInUser.fullname}</div>
                </div>
                <div className="menu" onClick={() => userActions.logoutUser()}>Logout</div>
            </div>
            <div className="suggested">Suggested for you</div>

            {suggestedUsers.map(user =>
                <div className="suggestedUser-details">
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