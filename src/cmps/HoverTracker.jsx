import React, { useState, Children, cloneElement, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_USER_MODAL_DATA } from '../store/reducers/post.reducer.js'

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

    useEffect(() => {
        if (!myElementRef.current) return

        const rect = myElementRef.current.getBoundingClientRect()

        const x = rect.x + window.scrollX + rect.width / 2
        const y = rect.y + window.scrollY + rect.height / 2

        if (currentCoords?.y !== y) {
            dispatch({ type: SET_USER_MODAL_DATA, userModalData: { open: isHovering ? true : false, username, coords: { x, y } } })
        }
    }, [mousePos, isHovering])
    
    useEffect(() => {
        dispatch({ type: SET_USER_MODAL_DATA, userModalData: { ...userModalData, open: (isHovering || hoveringOverModal) ? true : false}})
    }, [isHovering, hoveringOverModal])

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