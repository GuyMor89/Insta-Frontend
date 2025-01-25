import { useSelector } from "react-redux";
import { RemoveScroll } from "react-remove-scroll";
import { postActions } from "../store/actions/post.actions.js";
import { interactionService } from "../services/interactions.service.js";
import { Modal } from "./Modal.jsx";

export function GlobalModal() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)

    const openModals = useSelector(storeState => {
        const entry = Object.entries(storeState.postModule?.modals).filter(([modalName, modal]) => modal.open)
        return entry.map(modal => ({ modalName: modal[0], data: modal[1].data }))
    })

    const anyModalsOpen = openModals.length > 0
    if (!anyModalsOpen) return

    const menuModalOpen = openModals[0].modalName === 'menuModal'
    if (menuModalOpen) {

        const post = openModals[0].data
        const myPost = post.by._id === fullLoggedInUser._id
        const alreadyFollowingUser = fullLoggedInUser.following.some(_id => _id === post.by._id)

        function handleFollowBtn() {
            if (!myPost && !alreadyFollowingUser) return (<button className="follow-btn" onClick={() => { interactionService.followUser(post.by._id); postActions.closeModal('menu') }}>Follow</button>)
            if (!myPost && alreadyFollowingUser) return (<button className="follow-btn" onClick={() => { interactionService.unfollowUser(post.by._id); postActions.closeModal('menu') }}>Unfollow</button>)
        }

        return (
            <Modal modalName={'menu'}>
                {handleFollowBtn()}
                <button className="negative" onClick={() => postActions.closeModal('menu')}>Cancel</button>
            </Modal>
        )
    }

    const dialogueModalOpen = openModals[1].modalName === 'dialogueModal'
    if (dialogueModalOpen)

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