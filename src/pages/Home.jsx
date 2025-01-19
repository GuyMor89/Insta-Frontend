import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { postActions } from "../store/actions/post.actions.js"
import { userService } from "../services/user.service.js"
import { Post } from "../cmps/Post.jsx"
import { userActions } from "../store/actions/user.actions.js"

export function Home() {

    const posts = useSelector(storeState => storeState.postModule.posts)
    const users = useSelector(storeState => storeState.userModule.users)
    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)
    const [fullLoggedInUser, setFullLoggedInUser] = useState(null)

    useEffect(() => {
        postActions.loadPosts()
        userActions.loadUsers()
    }, [])

    useEffect(() => {
        if (loggedInUser) getFullLoggedInUser()
    }, [loggedInUser, users])

    async function getFullLoggedInUser() {
        const fullLoggedInUser = await userService.getById(loggedInUser._id)
        setFullLoggedInUser(fullLoggedInUser)
    }

    if (!posts || !fullLoggedInUser) return

    return (
        <article className="post-container" >
            {posts.map((post, idx) =>
                <Post post={post} fullLoggedInUser={fullLoggedInUser} isLast={idx === posts.length - 1} />
            )}
        </article >
    )
}