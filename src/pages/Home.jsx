import { useRef } from "react"


export function Home() {

    const testPost = useRef({
        _id: 'p101',
        text: 'This is a test post',
        imgUrl: 'https://res.cloudinary.com/dtkjyqiap/image/upload/v1735435295/rmwumux6gzy31sjnktvg.png',
        by: {
            _id: 'u101',
            fullname: 'Mr. Test',
            imgUrl: 'https://res.cloudinary.com/dtkjyqiap/image/upload/v1736381008/profile_pirpak.jpg',
        },
        loc: 'Atakum, Samsun',
        comments: [
            {
                id: 'c1001',
                by: {
                    _id: 'u105',
                    fullname: 'Bob',
                    imgUrl: 'https://res.cloudinary.com/dtkjyqiap/image/upload/v1736381008/profile_pirpak.jpg',
                },
                text: 'good one!',
                likedBy: [
                    {
                        _id: 'u105',
                        fullname: 'Bob',
                        imgUrl: 'https://res.cloudinary.com/dtkjyqiap/image/upload/v1736381008/profile_pirpak.jpg',
                    },
                ],
            },
            {
                id: 'c1002',
                by: {
                    _id: 'u106',
                    fullname: 'Dob',
                    imgUrl: 'https://res.cloudinary.com/dtkjyqiap/image/upload/v1736381008/profile_pirpak.jpg',
                },
                text: 'not good!',
            },
        ],
        likedBy: ['u105', 'u106'],
        tags: ['fun', 'romantic'],
    })

    const { text, imgUrl, by, loc, comments, likedBy, tags } = testPost.current

    return (
        <article className="post-container">
            <div className="post">
                <div className="header">
                    <div className="user-image">
                        <img src={by.imgUrl} />
                    </div>
                    <div className="header-details-container">
                        <div className="header-details">
                            <div className="user-name">{by.fullname}</div>
                            <span>•</span>
                            <div className="created-at">1d</div>
                            <span>•</span>
                            <div className="follow-btn">Follow</div>
                        </div>
                        <div className="location">{loc}</div>
                    </div>
                    <svg className="menu" height="24" role="img" viewBox="0 0 24 24" width="24"><title>More options</title><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
                </div>
                <div className="main-image">
                    <img src={imgUrl} />
                </div>
                <div className="buttons">
                    <div className="like">
                        <svg fill="red" height="24" role="img" viewBox="0 0 48 48" width="24"><title>Unlike</title><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
                        {/* <svg height="24" role="img" viewBox="0 0 24 24" width="24"><title>Like</title><path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path></svg> */}
                    </div>
                    <div className="comment">
                        <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Comment</title><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
                    </div>
                    <div className="share">
                        <svg fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Share Post</title><line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                    </div>
                    <div className="save">
                        <svg height="24" role="img" viewBox="0 0 24 24" width="24"><title>Save</title><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon></svg>
                    </div>
                </div>
                <div className="likes">
                    <span>{likedBy.length} likes</span>
                </div>
                <div className="comment-container">
                    <div className="comment">
                        <div className="left-by">{comments[0].by.fullname}</div>
                        <div className="text">{comments[0].text}</div>
                    </div>
                    <div className="expand-comment">
                        <span>...</span> more</div>
                </div>
                <div className="open">
                    {`View all ${comments.length} comments`}
                </div>
                <div className="add-comment">
                    Add a comment...
                </div>
            </div>

        </article>
    )
}