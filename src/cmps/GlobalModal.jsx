import { useState } from "react";
import { useSelector } from "react-redux";

import Select from 'react-select'
import { Modal } from "./Modal.jsx";

import { interactionService } from "../services/interactions.service.js";
import { postActions } from "../store/actions/post.actions.js";
import { userActions } from "../store/actions/user.actions.js";
import { hookService } from "../services/hook.service.js";


export function GlobalModal() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const users = useSelector(storeState => storeState.userModule.users)
    const [chosenUser, setChosenUser] = useState(null)

    const { navigate } = hookService()

    const openModals = useSelector(storeState => {
        const entry = Object.entries(storeState.postModule?.modals).filter(([modalName, modal]) => modal.open)
        return entry.map(modal => ({ modalName: modal[0], data: modal[1].data }))
    })

    const anyModalsOpen = openModals.length > 0
    if (!anyModalsOpen) return

    const menuModalOpen = openModals[0].modalName === 'menuModal'
    if (menuModalOpen) {

        const userID = openModals[0].data
        const myID = fullLoggedInUser._id === userID
        const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === userID)

        function handleFollowBtn() {
            if (!myID && !alreadyFollowingUser) return (<button className="follow-btn" onClick={() => { interactionService.followUser(userID); postActions.closeModal('menu') }}>Follow</button>)
            if (!myID && alreadyFollowingUser) return (<button className="follow-btn" onClick={() => { interactionService.unfollowUser(userID); postActions.closeModal('menu') }}>Unfollow</button>)
        }

        return (
            <Modal modalName={'menu'}>
                {handleFollowBtn()}
                <button className="negative" onClick={() => postActions.closeModal('menu')}>Cancel</button>
            </Modal>
        )
    }

    const dialogueModalOpen = openModals[1]?.modalName === 'dialogueModal'
    if (dialogueModalOpen) {

        return (
            <Modal modalName={'dialogue'}>
                <div className="dialogue-container">
                    <span className="query">Discard Post?</span>
                    <span className="message">If you leave, your eddits won't be saved</span>
                </div>
                <button className="affirmative" onClick={() => { postActions.closeModal('create'); postActions.closeModal('dialogue') }}>Discard</button>
                <button className="negative" onClick={() => postActions.closeModal('dialogue')}>Cancel</button>
            </Modal>
        )
    }

    const switchUserModalOpen = openModals[0]?.modalName === 'switchUserModal'
    if (switchUserModalOpen) {

        const options = users.map(user => ({
            value: user.username,
            label: user.username
        }))

        async function switchUser() {
            await userActions.logoutUser()
            await userActions.loginUser({ username: chosenUser, password: 'vageta44' })
            navigate('/')
        }

        return (
            <Modal modalName={'switch'}>
                <div className="switch-user-container">
                    <Select
                        options={options}
                        onChange={(option) => setChosenUser(option.value)}
                        placeholder="Choose a user"
                    />
                    <button onClick={() => { switchUser(); postActions.closeModal('switch') }}>Log in</button>
                </div>
            </Modal>
        )
    }
}