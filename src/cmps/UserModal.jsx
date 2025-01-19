import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { userService } from "../services/user.service"
import { useNavigate } from "react-router-dom"


export function UserModal({ postBy, isLast }) {

    const [currUser, setCurrUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getUser()
    }, [])

    async function getUser() {
        const user = await userService.getByUsername(postBy.username)
        setCurrUser(user)
    }

    if (!currUser) return

    return (
        <div className={`user-modal ${isLast && 'last'}`} onClick={(e) => { e.stopPropagation() }}>
            <div className="user-details">
                <div className="user-image" onClick={() => navigate(`/${currUser.username}`)}>
                    <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1736627051/44884218_345707102882519_2446069589734326272_n_lutjai.jpg" />
                </div>
                <div className="header-details-container">
                    <div className="header-details">
                        <div className="user-name" onClick={() => navigate(`/${currUser.username}`)}>{currUser.username}</div>
                    </div>
                    <div className="full-name">{currUser.fullname}</div>
                </div>
            </div>
            <div className="user-data">
                <div className="user-posts">
                    <span>1,305</span>
                    posts
                </div>
                <div className="user-followers">
                    <span>73.3K</span>
                    followers
                </div>
                <div className="user-following">
                    <span>1,083</span>
                    following
                </div>
            </div>
            <div className="user-posts-container">
                {currUser.imgUrls.length > 0
                    ? currUser.imgUrls.map(image =>
                        <div className="user-post" onClick={() => navigate(`/p/${image._id}`, { state: { previousLocation: location.pathname } })}>
                            <img src={image.url} />
                        </div>
                    )
                    : <div className="no-posts">
                        <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1737130872/0qSQcHrCNzw_huro0j.png"></img>
                        <div className="no-posts-title">No posts yet</div>
                        <div className="no-posts-body">When {currUser.username} shares photos and reels, you'll see them here.</div>
                    </div>}
            </div>
            <button>
                <div className="follow-btn">
                    <svg fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20"><title></title><path d="M19.006 8.252a3.5 3.5 0 1 1-3.499-3.5 3.5 3.5 0 0 1 3.5 3.5Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></path><path d="M22 19.5v-.447a4.05 4.05 0 0 0-4.05-4.049h-4.906a4.05 4.05 0 0 0-4.049 4.049v.447" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" x1="5.001" x2="5.001" y1="7.998" y2="14.003"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" x1="8.004" x2="2.003" y1="11" y2="11"></line></svg>
                    <span>Follow</span>
                </div>
            </button>
        </div>
    )
}