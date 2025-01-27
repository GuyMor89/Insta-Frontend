import React, { useState, Children, cloneElement, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SET_USER_MODAL_DATA } from '../store/reducers/post.reducer.js'
import { useEffectSkipFirst } from '../services/hook.service.js'

export function HoverTracker({ children, username }) {

    const userModalData = useSelector(storeState => storeState.postModule.userModalData)
    const [isHovering, setIsHovering] = useState(false)
    const myElementRef = useRef(null)

    const dispatch = useDispatch()

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    useEffectSkipFirst(() => {
        if (isHovering) {
            if (!userModalData.open) {
                const rect = myElementRef.current.getBoundingClientRect();
                const x = rect.x + window.scrollX
                const y = rect.y + window.scrollY + (rect.height)

                dispatch({
                    type: SET_USER_MODAL_DATA,
                    userModalData: {
                        ...userModalData,
                        open: true,
                        username,
                        coords: { x, y },
                    },
                })
            }
        } else {
            if (userModalData.open) {
                dispatch({
                    type: SET_USER_MODAL_DATA,
                    userModalData: {
                        ...userModalData,
                        open: false,
                    },
                })
            }
        }
    }, [isHovering])

    const singleChild = Children.only(children)

    const childWithHandlers = cloneElement(singleChild, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        ref: myElementRef
    })

    return (
        <>
            {childWithHandlers}
        </>
    )


}