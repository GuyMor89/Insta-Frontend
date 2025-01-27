import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { postActions } from "../store/actions/post.actions.js"
import { Post } from "../cmps/Post.jsx"
import { userActions } from "../store/actions/user.actions.js"

export function Home() {

    const posts = useSelector(storeState => storeState.postModule.posts)
    const users = useSelector(storeState => storeState.userModule.users)

    const [postLimit, setPostLimit] = useState(4)
    const [isLoading, setIsLoading] = useState(false)

    const [isInView, setIsInView] = useState(false)
    const targetRef = useRef(null)

    const amountOfPosts = posts?.length

    useEffect(() => {
        postActions.loadPosts(postLimit)
        if (users.length === 0) userActions.loadUsers()
        setIsLoading(false)
    }, [postLimit])

    useEffect(() => {
        if (isInView && amountOfPosts > 0 && postLimit > amountOfPosts) setPostLimit(amountOfPosts)
        else if (isInView && postLimit === amountOfPosts) {
            setTimeout(() => {
                setPostLimit(amountOfPosts + 4)
            }, 500);
        }
    }, [isInView])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting)
                setIsLoading(true)
            },
            { root: null, rootMargin: '0px', threshold: 1 }
        )
        if (targetRef.current) {
            observer.observe(targetRef.current)
        }
        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current)
            }
        }
    }, [])

    if (!posts) return

    return (
        <article className="post-container" >
            {posts.map(post =>
                <Post post={post} />
            )}
            <div className="observed-div" ref={targetRef}>
                {isLoading && amountOfPosts > 0 && <img className='loader' src='https://res.cloudinary.com/dtkjyqiap/image/upload/v1737145287/ShFi4iY4Fd9_aww4yy.gif'></img>}
                {/* {amountOfPosts === postLimit &&
                    <div className="all-caught-up">
                        <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1737594357/illo-confirm-refresh-light_zdzg5x.png" />
                        <div className="title">You're all caught up</div>
                        <div className="body">You've seen all new posts from the past 3 days.</div>
                    </div>} */}
            </div>
        </article >
    )
}
