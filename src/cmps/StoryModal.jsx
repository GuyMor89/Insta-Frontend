import React from 'react'
import Stories from 'react-insta-stories'
import { Modal } from './Modal'

export function StoryModal() {

    const stories = [
        "https://res.cloudinary.com/dtkjyqiap/image/upload/v1737641337/wnbuttcvzw1rglpkc32u.jpg",
        "https://res.cloudinary.com/dtkjyqiap/image/upload/v1737641484/p9ewymmghrni6cjomagl.jpg",
        "https://res.cloudinary.com/dtkjyqiap/image/upload/v1737641576/j76oaypnjhvtx4vdingh.jpg"
    ]

    return (
        <Modal>
            <Stories
                stories={stories}
                defaultInterval={1500}
                width={432}
                height={768}
            />
        </Modal>
    )
}