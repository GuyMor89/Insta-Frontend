import React, { useState, Children, cloneElement, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_USER_MODAL_DATA } from '../store/reducers/post.reducer.js'
import { useEffectSkipFirst } from '../hooks/useEffectSkipFirst.jsx'
import { useParams } from 'react-router-dom'

export function HoverTracker({ children, username }) {

    const userModalData = useSelector(storeState => storeState.postModule.userModalData)
    const modalOpen = useSelector(storeState => storeState.postModule.userModalData.open)
    const hoveringOverModal = useSelector(storeState => storeState.postModule.hoveringOverModal)
    const currentCoords = useSelector(storeState => storeState.postModule.userModalData.coords)
    const [isHovering, setIsHovering] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const myElementRef = useRef(null)

    const dispatch = useDispatch()

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)
    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY })
    }

    useEffectSkipFirst(() => {
        // If we need to open it...
        if (isHovering) {
            // 1) Calculate new coords if you are *just* opening now
            if (!userModalData.open) {
                if (!myElementRef.current) return
                const rect = myElementRef.current.getBoundingClientRect();
                const x = rect.x + window.scrollX + rect.width / 2
                const y = rect.y + window.scrollY + rect.height / 2

                // 2) Dispatch open with new coords
                dispatch({
                    type: SET_USER_MODAL_DATA,
                    userModalData: {
                        ...userModalData,
                        open: true,
                        username,
                        coords: { x, y },
                    },
                })
            } else {
                // If it's already open, we might NOT need to recalc coords,
                // or you might recalc if the child has changed position.
                dispatch({
                    type: SET_USER_MODAL_DATA,
                    userModalData: {
                        ...userModalData,
                        open: true,
                    },
                });
            }
        } else {
            // Hover ended over both child and modal -> close
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
        onMouseMove: handleMouseMove,
        ref: myElementRef
    })

    return (
        <>
            {childWithHandlers}
        </>
    )


}