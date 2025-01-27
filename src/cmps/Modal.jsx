import React from 'react'
import { postActions } from '../store/actions/post.actions'

export function Modal({ children, modalName }) {
    return (
        <div className={`${modalName}-modal-overlay`} onClick={() => postActions.closeModal(modalName)}>
            <div className='modal-container' onClick={(e) => e.stopPropagation()} >
            <div className="close-btn" onClick={() => postActions.closeModal(modalName)}><svg fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Close</title><polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></polyline><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line></svg></div>
                <div className='modal'>
                    {children}
                </div>
            </div>
        </div >
    )
}
