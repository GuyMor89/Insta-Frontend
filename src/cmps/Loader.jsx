import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SET_IS_LOADING } from "../store/reducers/post.reducer"
import { RemoveScroll } from "react-remove-scroll"

export function Loader() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const isLoading = useSelector(storeState => storeState.postModule.isLoading)
    console.log(isLoading)

    if (!isLoading || !fullLoggedInUser) return

    return (
        <RemoveScroll>
            <article className="loader">
                <img className="logo" src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1738811234/nmvf9gbwitbxi68y3oi1.png" />
                <img className="from-meta" src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1738811234/gml1vajrvmpgtfdccoa4.png" />
            </article>
        </RemoveScroll>
    )
}