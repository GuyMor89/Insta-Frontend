import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_CREATE_MODAL, SET_POST_MODAL } from '../store/reducers/post.reducer';
import { useNavigate, useParams } from 'react-router-dom';
import { postActions } from '../store/actions/post.actions.js';
import { userActions } from '../store/actions/user.actions.js';
import { Search } from './Search.jsx';
import { Notifications } from './Notifications.jsx';
import { UserMenu } from './UserMenu.jsx';
import { socketService } from '../services/socket.service.js';
import { hookService } from '../services/hook.service.js';

export function SideBar() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const newNotifications = useSelector(storeState => storeState.userModule.newNotifications)
    const [page, setPage] = useState('home')
    const moreBtnRef = useRef()

    const [searchOpen, setSearchOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const { location, params, navigate } = hookService()

    useEffect(() => {
        if (location.pathname.includes('direct')) setPage('messenger')
        if (location.pathname.includes('explore')) setPage('explore')
    }, [location])

    if (!fullLoggedInUser) return

    return (
        <>
            <article className="side-bar">
                <div className="logo-btn" onClick={() => { setPage('home'); navigate('/') }}>
                    <svg className='logo-image' fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Instagram</title><path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"></path></svg>
                    <span className='logo-name'>Instagram</span>
                </div>
                <div className="home-btn" onClick={() => { setPage('home'); navigate('/') }}>
                    {page === 'home'
                        ? <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Home</title><path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path></svg>
                        : <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Home</title><path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none" stroke="currentColor" stroke-linejoin="round" strokeWidth="2"></path></svg>}
                    <span className={page === 'home' ? 'bold' : ''}>Home</span>
                </div>
                <div className="search-btn" onClick={() => { setPage(page === 'search' ? '' : 'search'); setSearchOpen(!searchOpen) }}>
                    {page === 'search'
                        ? <svg fill="currentColor" className='search' height="24" role="img" viewBox="0 0 24 24" width="24"><title>Search</title><path className='search' d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="3"></path><line className='search' fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="3" x1="16.511" x2="21.643" y1="16.511" y2="21.643"></line></svg>
                        : <svg fill="currentColor" className='search' height="24" role="img" viewBox="0 0 24 24" width="24"><title>Search</title><path className='search' d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2"></path><line className='search' fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>
                    }
                    <span className={`search ${page === 'search' ? 'bold' : ''}`}>Search</span>
                </div>
                <div className="explore-btn" onClick={() => { setPage('explore'); navigate('/explore') }}>
                    {page === 'explore'
                        ? <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Explore</title><path d="m13.173 13.164 1.491-3.829-3.83 1.49ZM12.001.5a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12.001.5Zm5.35 7.443-2.478 6.369a1 1 0 0 1-.57.569l-6.36 2.47a1 1 0 0 1-1.294-1.294l2.48-6.369a1 1 0 0 1 .57-.569l6.359-2.47a1 1 0 0 1 1.294 1.294Z"></path></svg>
                        : <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Explore</title><polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2"></polygon><polygon fillRule="evenodd" points="10.06 10.056 13.949 13.945 7.581 16.424 10.06 10.056"></polygon><circle cx="12.001" cy="12.005" fill="none" r="10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2"></circle></svg>
                    }
                    <span className={page === 'explore' ? 'bold' : ''}>Explore</span>
                </div>
                <div className="messenger-btn" onClick={() => { setPage('messenger'); navigate('/direct/inbox'); userActions.setNewNotifications({ ...newNotifications, message: false }) }}>
                    {page === 'messenger'
                        ? <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Messenger</title><path d="M12.003 1.131a10.487 10.487 0 0 0-10.87 10.57 10.194 10.194 0 0 0 3.412 7.771l.054 1.78a1.67 1.67 0 0 0 2.342 1.476l1.935-.872a11.767 11.767 0 0 0 3.127.416 10.488 10.488 0 0 0 10.87-10.57 10.487 10.487 0 0 0-10.87-10.57Zm5.786 9.001-2.566 3.983a1.577 1.577 0 0 1-2.278.42l-2.452-1.84a.63.63 0 0 0-.759.002l-2.556 2.049a.659.659 0 0 1-.96-.874L8.783 9.89a1.576 1.576 0 0 1 2.277-.42l2.453 1.84a.63.63 0 0 0 .758-.003l2.556-2.05a.659.659 0 0 1 .961.874Z"></path></svg>
                        : <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Messenger</title><path d="M12.003 2.001a9.705 9.705 0 1 1 0 19.4 10.876 10.876 0 0 1-2.895-.384.798.798 0 0 0-.533.04l-1.984.876a.801.801 0 0 1-1.123-.708l-.054-1.78a.806.806 0 0 0-.27-.569 9.49 9.49 0 0 1-3.14-7.175 9.65 9.65 0 0 1 10-9.7Z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="1.739"></path><path d="M17.79 10.132a.659.659 0 0 0-.962-.873l-2.556 2.05a.63.63 0 0 1-.758.002L11.06 9.47a1.576 1.576 0 0 0-2.277.42l-2.567 3.98a.659.659 0 0 0 .961.875l2.556-2.049a.63.63 0 0 1 .759-.002l2.452 1.84a1.576 1.576 0 0 0 2.278-.42Z" fillRule="evenodd"></path></svg>
                    }
                    <span className={page === 'messenger' ? 'bold' : ''}>Messenger</span>
                    {newNotifications.message && <div className='notification-bubble-notifications'></div>}
                </div>
                <div className="notifications-btn" onClick={() => { setPage(page === 'notifications' ? '' : 'notifications'); setNotificationsOpen(!notificationsOpen); userActions.setNewNotifications({ ...newNotifications, other: false }) }}>
                    {notificationsOpen
                        ? <svg fill="currentColor" className='notifications' height="24" role="img" viewBox="0 0 24 24" width="24"><title>Notifications</title><path d="M17.075 1.987a5.852 5.852 0 0 0-5.07 2.66l-.008.012-.01-.014a5.878 5.878 0 0 0-5.062-2.658A6.719 6.719 0 0 0 .5 8.952c0 3.514 2.581 5.757 5.077 7.927.302.262.607.527.91.797l1.089.973c2.112 1.89 3.149 2.813 3.642 3.133a1.438 1.438 0 0 0 1.564 0c.472-.306 1.334-1.07 3.755-3.234l.978-.874c.314-.28.631-.555.945-.827 2.478-2.15 5.04-4.372 5.04-7.895a6.719 6.719 0 0 0-6.425-6.965Z"></path></svg>
                        : <svg fill="currentColor" className='notifications' height="24" role="img" viewBox="0 0 24 24" width="24"><title>Notifications</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg>}
                    <span className={`notifications ${page === 'notifications' ? 'bold' : ''}`}>Notifications</span>
                    {newNotifications.other && <div className='notification-bubble-notifications'></div>}
                </div>
                <div className="create-btn" onClick={() => { setPage('create'), postActions.openModal('create') }}>
                    <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>New post</title><path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line></svg>
                    <span className={page === 'create' ? 'bold' : ''}>Create</span>
                </div>
                <div className="profile-btn" onClick={() => { setPage('profile'); navigate(`/${fullLoggedInUser.username}`) }}>
                    <img className={page === 'profile' ? 'bold' : ''} src={fullLoggedInUser.imgUrl || 'https://res.cloudinary.com/dtkjyqiap/image/upload/v1736627051/44884218_345707102882519_2446069589734326272_n_lutjai.jpg'}></img>
                    <span className={page === 'profile' ? 'bold' : ''}>Profile</span>
                </div>
                <div className="more-btn" ref={moreBtnRef} onClick={() => setMenuOpen(!menuOpen)}>
                    {page === 'more'
                        ? <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Settings</title><path d="M3.5 6.5h17a1.5 1.5 0 0 0 0-3h-17a1.5 1.5 0 0 0 0 3Zm17 4h-17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3Zm0 7h-17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3Z"></path></svg>
                        : <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Settings</title><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" x1="3" x2="21" y1="4" y2="4"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" x1="3" x2="21" y1="12" y2="12"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" x1="3" x2="21" y1="20" y2="20"></line></svg>
                    }
                    <span className={page === 'more' ? 'bold' : ''}>More</span>
                </div>
            </article >
            <Search searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
            <Notifications notificationsOpen={notificationsOpen} setNotificationsOpen={setNotificationsOpen} />
            <UserMenu moreBtnRef={moreBtnRef} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </>
    )
}