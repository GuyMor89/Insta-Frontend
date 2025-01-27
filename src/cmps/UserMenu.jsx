import { useEffect } from "react"
import { userActions } from "../store/actions/user.actions.js"

export function UserMenu({ menuOpen, setMenuOpen }) {

    useEffect(() => {
        const handleDocumentClick = (event) => { if (!event.target.closest('.user-menu-overlay') && !event.target.closest('.more-btn')) setMenuOpen(false) }
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    if (!menuOpen) return

    return (
        <div className="user-menu-overlay">
            <div className="user-menu-container">
                <div className="logout" onClick={() => { userActions.logoutUser(); setMenuOpen(false) }}>Logout</div>
            </div>
        </div>
    )
}