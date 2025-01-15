import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { postActions } from "../store/actions/post.actions"
import { useNavigate, useParams } from "react-router-dom"
import { userActions } from "../store/actions/user.actions"
import { userService } from "../services/user.service"


export function UserPage() {

    const [currUser, setCurrUser] = useState(null)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getUser()
    }, [params.username])
    
    async function getUser() {
        const user = await userService.getByUsername(params.username)
        setCurrUser(user)
    }
    if (!currUser) return <div></div>
    console.log(currUser.imgUrls)

    return (
        <article className="user-page-container">
            <div className="user-page-header-container">
                <div className="user-image">
                    <img src={currUser.imgUrl} />
                </div>
                <div className="user-page-header">
                    <div className="user-nav">
                        <div className="user-name">{currUser.username}</div>
                        <button className="follow-btn">Follow</button>
                        <button className="message-btn">Message</button>
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
                    <div className="user-description">
                        <div className="full-name">{currUser.fullname}</div>
                        <div className="user-bio">
                            {`Digital creator
                              📩|DM For Collaboration
                              Follow us for viral AI videos, trending content ©️
                              👇Shop Now 🛍️
                              lnk.bio/trendyhomefinds
                            `}
                        </div>
                        <div className="followed-by">Followed by <span>Another User</span></div>
                    </div>
                </div>
            </div>

            <div className="user-content-container">
                <div className="user-content-header">
                    <div className="user-posts-btn chosen">
                        <svg fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><rect fill="none" height="18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
                        <span>POSTS</span>
                    </div>
                    <div className="user-saved-btn">
                        <svg fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title></title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                        <span>SAVED</span>
                    </div>
                </div>
                <div className="user-posts-container">
                    {currUser.imgUrls.map(image =>
                        <div className="user-post" onClick={() => navigate(`/p/${image._id}`)}>
                            <img src={image.url} />
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}