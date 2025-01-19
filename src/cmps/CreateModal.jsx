import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { postActions } from "../store/actions/post.actions.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { SET_CREATE_MODAL } from "../store/reducers/post.reducer.js"
import { ImgUploader } from "./ImgUploader.jsx"
import { addFormikField } from '../cmps/Formik.jsx';

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

export function CreateModal() {
    const dispatch = useDispatch()

    const posts = useSelector(storeState => storeState.postModule.posts)
    const user = useSelector(storeState => storeState.userModule.loggedInUser)
    const modalOpen = useSelector(storeState => storeState.postModule.createModal.open)
    const [uploadedImage, setUploadedImage] = useState(null)
    const [currPage, setCurrPage] = useState(1)

    let formikRef = null

    function closeModal(event) {
        if (event.currentTarget.className === 'create-modal-overlay overlay-on') {
            if (uploadedImage) postActions.openModal('dialogue')
            else postActions.closeModal('create')
        }
    }

    useEffect(() => {
        if (uploadedImage) setCurrPage(2)
    }, [uploadedImage])

    useEffect(() => {
        if(!modalOpen) {
            setUploadedImage(null)
            setCurrPage(1)
        }
    }, [modalOpen])

    function handleHeader() {
        if (currPage === 1) return (
            <div className="header">
                <svg style={{ opacity: 0 }} className="back" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>
                <span>Create new post</span>
                <div style={{ opacity: 0 }} className="next">Next</div>
            </div >
        )
        if (currPage === 2) return (
            <div className="header">
                <svg className="back" onClick={() => { setUploadedImage(null); setCurrPage(1) }} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>
                <span>Crop</span>
                <div className="next" onClick={() => setCurrPage(3)}>Next</div>
            </div>
        )
        if (currPage === 3) return (
            <div className="header">
                <svg className="back" onClick={() => setCurrPage(2)} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>
                <span>Create new post</span>
                <div className="next" onClick={() => { formikRef && formikRef.submitForm(); postActions.closeModal('create') }}>Share</div>
            </div>
        )
    }

    const validationSchema = () => {
        return Yup.object({
            postBody: Yup.string()
                .required('Description is required')
                .min(3, 'At least 3 characters')
        })
    }

    return (
        <div className={modalOpen ? 'create-modal-overlay overlay-on' : 'create-modal-overlay'} onClick={closeModal}>
            {modalOpen && <div className={`modal-container ${currPage === 3 ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()} >
                <div className='modal'>
                    <article className='post-submit-container'>
                        {handleHeader()}
                        <div className="post-container">
                            {uploadedImage && <div className='post-image' >
                                <img src={uploadedImage} />
                            </div>}
                            {currPage === 3 && <div className="post-details">
                                <div className="user-details">
                                    <div className="user-image">
                                        <img src="https://res.cloudinary.com/dtkjyqiap/image/upload/v1736627051/44884218_345707102882519_2446069589734326272_n_lutjai.jpg" />
                                    </div>
                                    <div className="user-name">{user.username}</div>
                                </div>

                                <Formik
                                    initialValues={{
                                        postBody: '',
                                        postLocation: ''
                                    }}
                                    // validationSchema={validationSchema}
                                    onSubmit={(values) => {
                                        console.log(values)
                                        postActions.savePost({ caption: values.postBody, loc: values.postLocation, imgUrl: uploadedImage })
                                    }}
                                    innerRef={(instance) => (formikRef = instance)}
                                >
                                    {({ errors, touched }) => (
                                        <Form>
                                            {addFormikField(errors, touched, { fieldName: 'postBody', className: 'body-input', type: 'textarea', placeholder: 'Add description', focus: 'autoFocus' })}

                                            <div className="post-location">
                                                {addFormikField(errors, touched, { fieldName: 'postLocation', className: 'location-input', type: 'text', placeholder: "Add location", focus: 'none' })}
                                                <svg fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><title>Add location</title><path d="M12.053 8.105a1.604 1.604 0 1 0 1.604 1.604 1.604 1.604 0 0 0-1.604-1.604Zm0-7.105a8.684 8.684 0 0 0-8.708 8.66c0 5.699 6.14 11.495 8.108 13.123a.939.939 0 0 0 1.2 0c1.969-1.628 8.109-7.424 8.109-13.123A8.684 8.684 0 0 0 12.053 1Zm0 19.662C9.29 18.198 5.345 13.645 5.345 9.66a6.709 6.709 0 0 1 13.417 0c0 3.985-3.944 8.538-6.709 11.002Z"></path></svg>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                            </div>
                            }
                            <ImgUploader uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} />
                        </div>
                    </article>
                </div>
            </div>}
        </div >
    )
}


