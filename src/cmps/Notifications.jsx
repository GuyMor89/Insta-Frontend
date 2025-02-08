import { useEffect, useState } from "react"
import { notificationService } from '../services/notifications.service.js'
import { hookService } from '../services/hook.service.js'
import { utilService } from '../services/util.service.js'
import { useSelector } from "react-redux"
import { postActions } from "../store/actions/post.actions.js"
import { interactionService } from "../services/interactions.service.js"
import { messageService } from "../services/message.service.js"
import { SET_MESSAGES } from "../store/reducers/user.reducer.js"
import { userActions } from "../store/actions/user.actions.js"
import { socketService } from "../services/socket.service.js"

export function Notifications({ notificationsOpen, setNotificationsOpen }) {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const [notifications, setNotifications] = useState(null)
    const newNotifications = useSelector(storeState => storeState.userModule.newNotifications)
    const messages = useSelector(storeState => storeState.userModule.messages)

    const { navigate, dispatch, location } = hookService()

    useEffect(() => {
        if (notificationsOpen) getNotifications()
    }, [notificationsOpen])

    async function getNotifications() {
        const notifications = await notificationService.query()
        setNotifications(notifications)
        notificationService.markRead()
    }

    useEffect(() => {
        getMessages()
    }, [location, newNotifications.message])

    const getMessages = async () => {
        const messages = await messageService.query()
        dispatch({ type: SET_MESSAGES, messages })
        if (messages.some(message => message.hasUnread)) userActions.setNewNotifications({ ...newNotifications, message: true })
        if (!messages.some(message => message.hasUnread)) userActions.setNewNotifications({ ...newNotifications, message: false })
    }

    useEffect(() => {
        socketService.on('notification-from-server', handleNotifications)
        socketService.on('msg-from-server', handleNotifications)

        function handleNotifications(data) {
            if (data.messageID) getMessages()
            if (data.action) userActions.setNewNotifications({ ...newNotifications, other: true })
        }

        return () => {
            socketService.off('notification-from-server', handleNotifications)
            socketService.off('msg-from-server', handleNotifications)
        }
    }, [])


    function handleActivityText({ type, action, createdAt }) {
        if (type === 'post') {
            if (action === 'like') return <><span>liked your&nbsp;photo.</span><span className="sent-at">{utilService.formatDate(createdAt).relativeTime}</span></>
            if (action === 'comment') return <><span>commented on your&nbsp;post.</span><span className="sent-at">{utilService.formatDate(createdAt).relativeTime}</span></>
            if (action === 'save') return <><span>saved your&nbsp;photo.</span><span className="sent-at">{utilService.formatDate(createdAt).relativeTime}</span></>
        }
        if (action === 'follow') return <><span>started following&nbsp;you.</span><span className="sent-at">{utilService.formatDate(createdAt).relativeTime}</span></>
    }

    function handleButtons(action, userID) {
        if (action !== 'follow') return
        const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === userID)

        if (!alreadyFollowingUser) return <div className="follow-btn" onClick={(e) => { e.stopPropagation(); interactionService.followUser(userID) }}>Follow</div>
        if (alreadyFollowingUser) return <div className="follow-btn grey" onClick={(e) => { e.stopPropagation(); postActions.openModal('menu', userID) }}>Following <span><svg fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12" style={{ transform: 'rotate(180deg)' }}><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"></path></svg></span></div>
    }

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (event.target.closest('.main-container') || (event.target.closest('.side-bar') && (!event.target.classList.contains('notifications')) && (!event.target.classList.contains('notifications-btn')) && (!event.target.classList.contains('side-bar'))))
                setNotificationsOpen(false)
        }
        document.addEventListener('click', handleDocumentClick)

        return () => {
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    return (
        <article className="notifications-overlay">
            <div className={`notifications-container ${notificationsOpen ? 'open' : ''}`}>
                <div className="title">
                    Notifications
                </div>
                <div className="notifications">
                    {notifications?.map(activity =>
                        <div className="activity-container" onClick={() => { activity._id ? navigate(`/p/${activity._id}`, { state: { previousLocation: location.pathname } }) : navigate(`/${activity.by.username}`); setNotificationsOpen(false) }}>
                            <div className="from-user-details">
                                <div className="user-image">
                                    <img src={activity.by.imgUrl} />
                                </div>
                                <div className="header-details-container">
                                    <div className="header-details">
                                        <div className="user-name" onClick={(e) => { e.stopPropagation(); navigate(`/${activity.by.username}`); setNotificationsOpen(false) }}>{activity.by.username}</div>
                                        {handleActivityText(activity)}
                                    </div>
                                </div>
                                {handleButtons(activity.action, activity.by._id)}
                                {activity.imgUrl && <img src={activity.imgUrl} />}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}