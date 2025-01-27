import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { postService } from '../services/post.service.js'

export function Explore() {

    const [allPosts, setAllPosts] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        getAllPosts()
    }, [])
    
    async function getAllPosts() {
      const allPosts = await postService.query()
        setAllPosts(allPosts)
    }

    if (!allPosts) return

    return (
        <div className="explore-container">
            {allPosts.map(post =>
                <div className="post" onClick={() => navigate(`/p/${post._id}`, { state: { previousLocation: location.pathname } })}>
                    <img src={post.imgUrl} />
                </div>)}
        </div>
    )
}