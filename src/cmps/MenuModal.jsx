import { useSelector } from "react-redux";
import { RemoveScroll } from "react-remove-scroll";
import { postActions } from "../store/actions/post.actions.js";

export function MenuModal() {

    const modalOpen = useSelector(storeState => storeState.postModule.menuModal.open)

    function closeModal(event) {
        if (event.currentTarget.className === 'menu-modal-overlay overlay-on') postActions.closeModal('menu')
    }

    return (
        // <RemoveScroll>
        <div className={modalOpen ? 'menu-modal-overlay overlay-on' : 'menu-modal-overlay'} onClick={closeModal}>
            {modalOpen && <div className='modal-container' onClick={(e) => e.stopPropagation()} >
                <div className='modal'>
                    <button className="affirmative" onClick={() => postActions.closeModal('menu')}>Unfollow</button>
                    <button className="negative" onClick={() => postActions.closeModal('menu')}>Cancel</button>
                </div>
            </div>}
        </div>
        // </RemoveScroll>
    )
}