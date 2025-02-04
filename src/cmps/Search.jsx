import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { utilService } from '../services/util.service.js'
import { userService } from "../services/user.service"

export function Search({ searchOpen, setSearchOpen }) {

    const [searchText, setSearchText] = useState(null)
    const [foundUsers, setfoundUsers] = useState(null)

    const [isFocused, setIsFocused] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const debounceSearch = useRef(utilService.debounce(setSearchText, 500))
    const inputRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (!searchOpen) inputRef.current.value = ''
        if (searchOpen) inputRef.current.focus()
    }, [searchOpen])

    useEffect(() => {
        if (searchText) searchForUsers()
        setIsLoading(false)
    }, [searchText])

    async function searchForUsers() {
        const usersFound = await userService.getUsers(searchText)
        setfoundUsers(usersFound)
    }

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (event.target.closest('.main-container') || (event.target.closest('.side-bar') && (!event.target.classList.contains('search')) && (!event.target.classList.contains('search-btn')) && (!event.target.classList.contains('side-bar'))))
                setSearchOpen(false)
        }
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    return (
        <article className="search-overlay">
            <div className={`search-container ${searchOpen ? 'open' : ''}`}>
                <div className="title">
                    Search
                </div>
                <div className="search-bar">
                    {isFocused ? '' : <svg className="search-svg" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><title>Search</title><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>}
                    <input type="text" ref={inputRef} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onChange={(ev) => { debounceSearch.current(ev.target.value); setIsLoading(true) }} placeholder="Search" />
                    {isLoading
                        ? <svg className="loader-svg" role="img" viewBox="0 0 100 100"><rect height="6" opacity="0" rx="3" ry="3" transform="rotate(-90 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.08333333333333333" rx="3" ry="3" transform="rotate(-60 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.16666666666666666" rx="3" ry="3" transform="rotate(-30 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.25" rx="3" ry="3" transform="rotate(0 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.3333333333333333" rx="3" ry="3" transform="rotate(30 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.4166666666666667" rx="3" ry="3" transform="rotate(60 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.5" rx="3" ry="3" transform="rotate(90 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.5833333333333334" rx="3" ry="3" transform="rotate(120 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.6666666666666666" rx="3" ry="3" transform="rotate(150 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.75" rx="3" ry="3" transform="rotate(180 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.8333333333333334" rx="3" ry="3" transform="rotate(210 50 50)" width="25" x="72" y="47"></rect><rect height="6" opacity="0.9166666666666666" rx="3" ry="3" transform="rotate(240 50 50)" width="25" x="72" y="47"></rect></svg>
                        : <img onClick={() => inputRef.current.value = ''} src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1737841483/erase_o9ttgf.png" alt="" />}
                </div>
                <div className="results">
                    {foundUsers?.map(user =>
                        <div className="found-user-details" onClick={() => { navigate(`/${user.username}`); setSearchOpen(false); setfoundUsers(null) }}>
                            <div className="user-image">
                                <img src={user.imgUrl} />
                            </div>
                            <div className="header-details-container">
                                <div className="header-details">
                                    <div className="user-name">{user.username}</div>
                                </div>
                                <div className="fullname">{user.fullname}</div>
                            </div>
                        </div>)}
                    {foundUsers?.length === 0 &&
                        <div className="no-users-found">
                            No users found
                        </div>
                    }
                </div>
            </div>
        </article>
    )
}