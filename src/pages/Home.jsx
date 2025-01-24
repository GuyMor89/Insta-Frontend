import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { postActions } from "../store/actions/post.actions.js"
import { Post } from "../cmps/Post.jsx"
import { userActions } from "../store/actions/user.actions.js"

export function Home() {

    const posts = useSelector(storeState => storeState.postModule.posts)
    const users = useSelector(storeState => storeState.userModule.users)
    const [isLoading, setIsLoading] = useState(false)

    const [isInView, setIsInView] = useState(false)
    const [postLimit, setPostLimit] = useState({ limit: 4 })
    const targetRef = useRef(null)

    const dispatch = useDispatch()
    const { limit } = postLimit
    const amountOfPosts = posts?.length

    useEffect(() => {
        postActions.loadPosts(postLimit)
        if (users.length === 0) userActions.loadUsers()
        setIsLoading(false)
    }, [postLimit])

    useEffect(() => {
        if (isInView && amountOfPosts > 0 && limit > amountOfPosts) setPostLimit({ limit: amountOfPosts })
        else if (isInView && limit <= amountOfPosts) {
            setTimeout(() => {
                setPostLimit({ limit: amountOfPosts + 4 })
            }, 500);
        }
    }, [isInView])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // This callback is run whenever the visibility of the target element changes
                setIsInView(entry.isIntersecting)
                setIsLoading(true)
            },
            {
                root: null,       // observes the viewport
                rootMargin: '0px',
                threshold: 1    // adjust as needed (0.1 means at least 10% visible)
            }
        );

        if (targetRef.current) {
            observer.observe(targetRef.current)
        }

        // Cleanup to stop observing when component unmounts
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
                {/* {amountOfPosts === limit &&
                    <div className="all-caught-up">
                        <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1737594357/illo-confirm-refresh-light_zdzg5x.png" />
                        <div className="title">You're all caught up</div>
                        <div className="body">You've seen all new posts from the past 3 days.</div>
                    </div>} */}
            </div>
        </article >
    )
}

// Loader
{/* <svg aria-label="Loading..." class="xemfg65 xa4qsjk x1ka1v4i xbv57ra" role="img" viewBox="0 0 100 100"><rect class="x1i210e2" height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect class="x1i210e2" height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg> */}