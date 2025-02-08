import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { Post } from "../cmps/Post.jsx"

import { postService } from "../services/post.service.js"
import { hookService } from "../services/hook.service.js"

export function Home() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const [posts, setPosts] = useState(null)

    const [postLimit, setPostLimit] = useState(4)
    const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false)
    const [checkPosts, setCheckPosts] = useState(false)

    const [isInView, setIsInView] = useState(false)
    const targetRef = useRef(null)

    const { navigate, location } = hookService()

    const amountOfPosts = posts?.length
    const notFollowingAnyone = fullLoggedInUser?.following.length === 0

    useEffect(() => {
        getLimitedPosts()
    }, [postLimit, location, checkPosts])

    async function getLimitedPosts() {
        // if (!fullLoggedInUser) return
        const limitedPosts = await postService.query(postLimit)
        setPosts(limitedPosts)
        setIsLoadingMorePosts(false)
        setCheckPosts(false)
    }

    useEffect(() => {
        // if (amountOfPosts < 2) return
        setIsLoadingMorePosts(true)

        if (isInView && amountOfPosts > 0 && postLimit > amountOfPosts) setPostLimit(amountOfPosts)
        else if (isInView && postLimit === amountOfPosts) {
            setTimeout(() => {
                setPostLimit(amountOfPosts + 4)
            }, 500)
        }
    }, [isInView])

    useEffect(() => {
        const checkRefAndObserve = () => {
            if (targetRef.current) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        setIsInView(entry.isIntersecting)
                    },
                    { root: null, rootMargin: '0px', threshold: 1 }
                )

                // console.log('Observing:', targetRef.current)
                observer.observe(targetRef.current)

                return () => observer.disconnect() // ✅ Proper cleanup
            }
        }

        const mutationObserver = new MutationObserver(checkRefAndObserve)
        mutationObserver.observe(document.body, { childList: true, subtree: true })

        checkRefAndObserve() // Run immediately in case the element is already available

        return () => mutationObserver.disconnect() // ✅ Stop observing when component unmounts
    }, [])


    if (!posts || !fullLoggedInUser) return

    return (
        <article className="post-container" >
            {posts.map(post =>
                <Post post={post} setCheckPosts={setCheckPosts} />
            )}
            <div className="observed-div" ref={targetRef}>
                {isLoadingMorePosts && amountOfPosts > 2 && <svg className="loader-svg" role="img" viewBox="0 0 100 100"><rect height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg>}
            </div>
            {!isLoadingMorePosts && !notFollowingAnyone &&
                <div className="all-caught-up">
                    <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1737594357/illo-confirm-refresh-light_zdzg5x.png" />
                    <div className="title">You're all caught up</div>
                    <div className="body">You've seen all new posts from the past 3 days.</div>
                </div>
            }
            {notFollowingAnyone &&
                < div className="not-following-anyone">
                    <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1738895576/ccg5hi2erjs0ztmfvh7s.png" />
                    <div className="title">Welcome to Instağram</div>
                    <div className="body">When you follow people, you'll see the photos they post here.</div>
                    <button className="find-friends" onClick={() => navigate('/explore')}>Find friends to follow</button>
                </div>
            }
        </article >
    )
}
