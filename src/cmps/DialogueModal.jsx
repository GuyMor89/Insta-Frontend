import { useSelector } from "react-redux";
import { RemoveScroll } from "react-remove-scroll";
import { postActions } from "../store/actions/post.actions";

export function DialogueModal() {

    const modalOpen = useSelector(storeState => storeState.postModule.dialogueModal.open)

    function closeModal(event) {
        if (event.currentTarget.className === 'dialogue-modal-overlay overlay-on') postActions.closeModal('dialogue')
    }

    return (
        // <RemoveScroll>
            <div className={modalOpen ? 'dialogue-modal-overlay overlay-on' : 'dialogue-modal-overlay'} onClick={closeModal}>
                {modalOpen && <div className='modal-container' onClick={(e) => e.stopPropagation()} >
                    <div className='modal'>
                        <div className="dialogue-container">
                            <span className="query">Discard Post?</span>
                            <span className="message">If you leave, your eddits won't be saved</span>
                        </div>
                        <button className="affirmative" onClick={() => {postActions.closeModal('create'); postActions.closeModal('dialogue')}}>Discard</button>
                        <button className="negative" onClick={() => postActions.closeModal('dialogue')}>Cancel</button>
                    </div>
                </div>}
            </div>
        // </RemoveScroll>
    )
}