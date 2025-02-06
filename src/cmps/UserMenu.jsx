import { useEffect, useState } from "react"
import { userActions } from "../store/actions/user.actions.js"

export function UserMenu({ moreBtnRef, menuOpen, setMenuOpen }) {

    const [moreMenuCoords, setMoreMenuCoords] = useState(null)

    useEffect(() => {
        const handleDocumentClick = (event) => { if (!event.target.closest('.user-menu-overlay') && !event.target.closest('.more-btn')) setMenuOpen(false) }
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    useEffect(() => {
        const rect = moreBtnRef.current.getBoundingClientRect()
        const x = rect.x + window.scrollX
        const y = rect.y + window.scrollY + (rect.height)
        setMoreMenuCoords({ x, y })
    }, [menuOpen])

    if (!menuOpen) return

    return (
        <div className="user-menu-overlay" style={{ '--more-btn-left': `${moreMenuCoords?.x}px`, '--more-btn-top': `${moreMenuCoords?.y}px` }}>
            <div className="user-menu-container">
                <div className="logout" onClick={() => { userActions.logoutUser(); setMenuOpen(false) }}>Logout</div>
            </div>
        </div>
    )
}