import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { messageService } from "../services/message.service.js"
import { utilService } from '../services/util.service.js'
import { socketService } from "../services/socket.service.js"
import { hookService } from "../services/hook.service.js"
import { userActions } from "../store/actions/user.actions.js"

export function Messenger() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const newNotifications = useSelector(storeState => storeState.userModule.newNotifications)
    const messages = useSelector(storeState => storeState.userModule.messages)
    const [chosenMessage, setChosenMessage] = useState(null)
    const chosenRef = useRef(chosenMessage)

    const [line, setLine] = useState(null)
    const messageInput = useRef(null)
    const messageContainer = useRef(null)

    const { params, navigate, location } = hookService()

    useEffect(() => {
        setChosenMessage(messages?.find(message => message._id === params.id) || null)
        const unReadMessage = messages.filter(message => message.hasUnread)

        if (unReadMessage.length === 0) return
        if (params.id === unReadMessage[0]._id) {
            messageService.markRead(unReadMessage[0]._id)
            userActions.setNewNotifications({ ...newNotifications, message: false })
        }
    }, [messages, params.id])

    useEffect(() => {
        chosenRef.current = chosenMessage
    }, [chosenMessage])

    useEffect(() => {
        socketService.on('msg-from-server', addLine)

        function addLine({ messageID, lineToSend }) {
            if (!chosenMessage) return
            if (messageID !== chosenRef.current._id) return
            setChosenMessage(prevMessage => ({ ...prevMessage, lines: [...prevMessage.lines, lineToSend] }))
        }

        return () => {
            socketService.off('msg-from-server', addLine)
        }
    }, [])

    function sendMessage() {
        const lineToSend = { id: utilService.makeId(), by: fullLoggedInUser.username, text: line, sentAt: Date.now(), isRead: false }
        messageService.addLine(chosenMessage.user._id, chosenMessage._id, lineToSend)

        setChosenMessage(prevMessage => ({ ...prevMessage, lines: [...prevMessage.lines, lineToSend] }))

        messageInput.current.value = ''
        setLine(null)
    }

    useEffect(() => {
        if (messageContainer.current) {
            messageContainer.current.scrollTop = messageContainer.current.scrollHeight
        }
    }, [chosenMessage])

    if (!fullLoggedInUser || !messages) return

    return (
        <article className={`messenger-container ${params.id ? 'message-open' : ''}`}>
            <div className="side-bar">
                <div className="side-bar-header">
                    <div className="user-name">{fullLoggedInUser.username} <svg aria-label="Down chevron icon" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title>Down chevron icon</title><path d="M12 17.502a1 1 0 0 1-.707-.293l-9-9.004a1 1 0 0 1 1.414-1.414L12 15.087l8.293-8.296a1 1 0 0 1 1.414 1.414l-9 9.004a1 1 0 0 1-.707.293Z"></path></svg></div>
                    <svg className="new-message-button" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>New message</title><path d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.848" x2="20.076" y1="3.924" y2="7.153"></line></svg>
                </div>
                <div className="user-image">
                    <img src={fullLoggedInUser.imgUrl} />
                </div>
                <div className="title">Messages</div>
                <div className="messages-list">

                    {messages.map(message =>
                        <div className={`user-details ${chosenMessage?._id === message._id ? 'chosen' : ''}`} onClick={() => { { messageService.markRead(message._id); navigate(chosenMessage?._id === message._id ? '/direct/inbox' : `/direct/t/${message._id}`) } }}>
                            <div className="user-image">
                                <img src={message.user.imgUrl} />
                            </div>
                            <div className="header-details-container">
                                <div className="header-details">
                                    <div className={`user-name ${(message.hasUnread && !location.pathname.includes('/t/')) ? 'bold' : ''}`}>{message.user.fullname}</div>
                                    {message.hasUnread && !location.pathname.includes('/t/') && <div className='new-message-notification'></div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <div className="no-messages-found"><span>No messages found.</span></div> */}
                </div>
            </div>
            <div className="chosen-message-container">

                {chosenMessage
                    ? <>
                        <div className="container-header">
                            <div className="header-details-container">
                                <svg onClick={() => navigate('/direct/inbox')} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>
                                <div className="user-image">
                                    <img src={chosenMessage.user.imgUrl} />
                                </div>
                                <div className="header-details">
                                    <div className="user-name">{chosenMessage.user.username}</div>
                                </div>
                            </div>
                        </div>

                        <div className="message-header">
                            <div className="header-details-container">
                                <div className="user-image">
                                    <img src={chosenMessage.user.imgUrl} />
                                </div>
                                <div className="header-details">
                                    <div className="full-name">{chosenMessage.user.fullname}</div>
                                    <div className="user-name">{chosenMessage.user.username} · Instagram</div>
                                </div>
                                <button className="view-profile" onClick={() => navigate(`/${chosenMessage.user.username}`)}>View Profile</button>
                            </div>
                        </div>

                        <div className="message-content-container" ref={messageContainer}>
                            <div className="message-container">
                                <>
                                    {chosenMessage.lines.map((msg, index, arr) => {
                                        const currLineTimestamp = utilService.formatDate(msg.sentAt).shortHour;
                                        const previousMsg = index > 0 ? arr[index - 1] : null;
                                        const previousTimestamp = previousMsg
                                            ? utilService.formatDate(previousMsg.sentAt).shortHour
                                            : null;
                                        const timestampIsNew = !previousMsg || currLineTimestamp !== previousTimestamp;
                                        const userIsNew = !previousMsg || msg.by !== previousMsg.by;
                                        const isCurrentUser = msg.by === fullLoggedInUser.username;
                                        const textClassName = `text${isCurrentUser ? '' : ' grey'}`;
                                        const showTimestamp = timestampIsNew || userIsNew;

                                        return (
                                            <div className="message" key={msg.id}>
                                                {showTimestamp && (
                                                    <div className="sent-at">
                                                        {currLineTimestamp}
                                                    </div>
                                                )}
                                                <div className={textClassName}>
                                                    {!isCurrentUser && (userIsNew || timestampIsNew) && (
                                                        <img src={chosenMessage.user.imgUrl} alt={`${msg.by} avatar`} />
                                                    )}
                                                    <span>{msg.text}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            </div>
                        </div>

                        <div className="send-message-container">
                            <div className="message-bar">
                                <input type="text" ref={messageInput} onChange={(e) => setLine(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }} placeholder="Message.." />
                                <button className={line?.length > 0 && 'full'} onClick={() => sendMessage()}>Send</button>
                            </div>
                        </div>
                    </>

                    : <div className="start-new-message">
                        <svg height="96" role="img" viewBox="0 0 96 96" width="96"><title></title><path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"></path></svg>
                        <span className="title">Your messages</span>
                        <span className="body">Send a messsage to start a chat.</span>
                        <button className="start-chat">Send message</button>
                    </div>

                }
            </div>
        </article>
    )
}