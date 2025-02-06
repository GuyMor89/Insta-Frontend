import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { postService } from '../services/post.service.js'
import { postActions } from "../store/actions/post.actions.js"
import { useSelector } from "react-redux"

export function Explore() {

    const posts = useSelector(storeState => storeState.postModule.posts)
    const navigate = useNavigate()

    useEffect(() => {
        postActions.loadPosts()
    }, [])

    if (!posts) return

    return (
        <article className="explore-container">
            {posts.map(post =>
                <div className="post" onClick={() => navigate(`/p/${post._id}`, { state: { previousLocation: location.pathname } })}>
                    <img src={post.imgUrl} />
                </div>)}
        </article>
    )
}