export const uploadService = {
    uploadImg
}

async function uploadImg(ev) {
    const CLOUD_NAME = "dtkjyqiap"
    const UPLOAD_PRESET = "default"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    try {
        const file = ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
        const formData = new FormData()
        formData.append('upload_preset', UPLOAD_PRESET)
        formData.append('file', file)

        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const imgData = await res.json()
        console.log('imgData', imgData)
        return imgData
    } catch (err) {
        console.error('Failed to upload', err)
        throw err
    }
}