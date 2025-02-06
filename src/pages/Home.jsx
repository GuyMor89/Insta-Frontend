import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { postActions } from "../store/actions/post.actions.js"
import { Post } from "../cmps/Post.jsx"
import { userActions } from "../store/actions/user.actions.js"
import { useLocation } from "react-router-dom"
import { postService } from "../services/post.service.js"

export function Home() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const [posts, setPosts] = useState(null)

    const [postLimit, setPostLimit] = useState(4)
    const [isLoadingMorePosts, setisLoadingMorePosts] = useState(false)

    const [isInView, setIsInView] = useState(false)
    const targetRef = useRef(null)

    const location = useLocation()

    const amountOfPosts = posts?.length
    
    useEffect(() => {
        if (!fullLoggedInUser) return
        postActions.setIsLoading(true)
        getLimitedPosts()
    }, [postLimit]) // location?
    
    async function getLimitedPosts() {
        const limitedPosts = await postService.query(postLimit)
        setPosts(limitedPosts)
        setisLoadingMorePosts(false)
        postActions.setIsLoading(false)
    }

    useEffect(() => {
        if (isInView && amountOfPosts > 0 && postLimit > amountOfPosts) setPostLimit(amountOfPosts)
        else if (isInView && postLimit === amountOfPosts) {
            setTimeout(() => {
                setPostLimit(amountOfPosts + 4)
            }, 500)
        }
    }, [isInView])

    useEffect(() => {
        if (amountOfPosts < 2) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting)
                setisLoadingMorePosts(true)
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

    if (!posts || !fullLoggedInUser) return

    return (
        <article className="post-container" >
            {posts.map(post =>
                <Post post={post} />
            )}
            <div className="observed-div" ref={targetRef}>
                {isLoadingMorePosts && amountOfPosts > 0 && amountOfPosts > 2 && <svg className="loader-svg" role="img" viewBox="0 0 100 100"><rect height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg>}
            </div>
            {!isLoadingMorePosts &&
            <div className="all-caught-up">
                <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1737594357/illo-confirm-refresh-light_zdzg5x.png" />
                <div className="title">You're all caught up</div>
                <div className="body">You've seen all new posts from the past 3 days.</div>
            </div>
            }
        </article >
    )
}
