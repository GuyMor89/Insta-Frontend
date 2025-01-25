import React from 'react'
import { postActions } from '../store/actions/post.actions'

export function Modal({ children, modalName }) {
    return (
        <div className={`${modalName}-modal-overlay overlay-on`} onClick={() => postActions.closeModal(modalName)}>
            <div className='modal-container' onClick={(e) => e.stopPropagation()} >
                <div className='modal'>
                    {children}
                </div>
            </div>
        </div >
    )
}
