import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Formik, Form } from 'formik'

import { ImgUploader } from "./ImgUploader.jsx"
import { addFormikField } from '../cmps/Formik.jsx';

import { postActions } from "../store/actions/post.actions.js"
import { utilService } from "../services/util.service.js"
import Cropper from "react-easy-crop";
import { uploadService } from "../services/upload.service.js";
import { hookService } from "../services/hook.service.js";

export function CreateModal() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const modalOpen = useSelector(storeState => storeState.postModule.modals.createModal.open)

    const [uploadedImage, setUploadedImage] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [currPage, setCurrPage] = useState(1)

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedPixels, setCroppedPixels] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    const { navigate } = hookService()
    let formikRef = null

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        // console.log(croppedArea, croppedAreaPixels)
        setCroppedPixels(croppedAreaPixels)
    }

    const handleSave = async () => {
        setIsUploading(true)

        const croppedBlob = await utilService.getCroppedImg(uploadedImage, croppedPixels)
        const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" })
        console.log(`File size: ${croppedFile.size}`)

        setTimeout(() => {
            setIsUploading(false)
        }, 800)

        const { secure_url } = await uploadService.uploadImg({ target: { files: [croppedFile] }, type: "change" })

        setIsUploading(false)
        setCroppedImage(secure_url)

        setCurrPage(3)
    }

    function closeModal() {
        if (uploadedImage) postActions.openModal('dialogue')
        else postActions.closeModal('create')
    }

    useEffect(() => {
        if (uploadedImage) setCurrPage(2)
    }, [uploadedImage])

    useEffect(() => {
        // if (currPage === 3) setIsUploading(false)
    }, [currPage])

    useEffect(() => {
        if (!modalOpen) {
            setUploadedImage(null)
            setCroppedImage(null)
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
                <svg className="back" onClick={() => { setUploadedImage(null); setCroppedImage(null); setCurrPage(1) }} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>
                <span>Crop</span>
                <div className="next" onClick={() => handleSave()}>Next</div>
            </div>
        )
        if (currPage === 3) return (
            <div className="header">
                <svg className="back" onClick={() => { setCroppedImage(null); setCurrPage(2) }} fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Back</title><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.909" x2="22.001" y1="12.004" y2="12.004"></line><polyline fill="none" points="9.276 4.726 2.001 12.004 9.276 19.274" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg>
                <span>Create new post</span>
                <div className="next" onClick={() => { formikRef && formikRef.submitForm(); postActions.closeModal('create') }}>Share</div>
            </div>
        )
    }

    if (!modalOpen) return

    function handleMainImages() {
        if (croppedImage) return <img className="cropped" src={croppedImage} />
        else if (isUploading) return <img className='loader-img' src='https://res.cloudinary.com/dtkjyqiap/image/upload/v1737145287/ShFi4iY4Fd9_aww4yy.gif'></img>
        return <Cropper image={uploadedImage} crop={crop} zoom={zoom} aspect={1 / 1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
    }

    return (
        <div className='create-modal-overlay' onClick={closeModal}>
            <div className={`modal-container ${currPage === 3 ? 'wide' : ''}`} onClick={(e) => e.stopPropagation()} >
                <div className="close-btn" onClick={() => closeModal()}><svg fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18"><title>Close</title><polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></polyline><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354"></line></svg></div>
                <div className='modal'>
                    <article className='post-submit-container'>
                        {handleHeader()}
                        <div className="post-container">
                            {uploadedImage && <div className='post-image'>{handleMainImages()}</div>}
                            {currPage === 3
                                && <div className="post-details">
                                    <div className="user-details">
                                        <div className="user-image">
                                            <img src={fullLoggedInUser.imgUrl} />
                                        </div>
                                        <div className="user-name">{fullLoggedInUser.username}</div>
                                    </div>

                                    <Formik
                                        initialValues={{
                                            postBody: '',
                                            postLocation: ''
                                        }}
                                        onSubmit={(values) => {
                                            console.log(values)
                                            postActions.savePost({ caption: values.postBody, loc: values.postLocation, imgUrl: croppedImage })
                                            navigate(`/${fullLoggedInUser.username}`)
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
            </div>
        </div >
    )
}


