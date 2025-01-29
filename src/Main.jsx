import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { hookService } from './services/hook.service.js'

import { Home } from './pages/Home.jsx'
import { SideBar } from './cmps/SideBar.jsx'
import { CreateModal } from './cmps/CreateModal.jsx'
import { PostModal } from './cmps/PostModal.jsx'
import { UserPage } from './pages/UserPage.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { UserModal } from './cmps/UserModal.jsx'
import { GlobalModal } from './cmps/GlobalModal.jsx'
import { UserBar } from './cmps/UserBar.jsx'
import { Explore } from './pages/Explore.jsx'
import { Messenger } from './pages/Messenger.jsx'

import { SET_PREV_LOC } from './store/reducers/post.reducer.js'

export function Main() {

    const prevLoc = useSelector(storeState => storeState.postModule.prevLoc)

    const { location, dispatch } = hookService()

    function saveRootLocation() {
        const previousLocation = location.state?.previousLocation
        const currentLocation = location.pathname

        const currLocationSegments = location.pathname.split("/")
        const prevLocationSegments = location.state?.previousLocation.split("/")

        if (currLocationSegments[1] !== "p" && !prevLocationSegments) dispatch({ type: SET_PREV_LOC, prevLoc: currentLocation })
        if (currLocationSegments[1] === "p" && !prevLocationSegments?.includes('p')) dispatch({ type: SET_PREV_LOC, prevLoc: previousLocation })
    }

    useEffect(() => {
        saveRootLocation()
    }, [location])

    return (
        <main className='main-app'>
            <LoginSignup />
            <GlobalModal />
            <CreateModal />
            <UserModal />
            <SideBar />
            <section className='main-container'>
                <Routes location={prevLoc || '/'}>
                    <Route path="/" element={<><Home /><UserBar /></>} />
                    <Route path='/explore' element={<Explore />} />
                    <Route path='/:username' element={<UserPage />} />
                    <Route path='/direct/inbox' element={<Messenger />} />
                    <Route path='/direct/t/:id' element={<Messenger />} />
                </Routes>
                <Routes>
                    <Route path='/p/:id' element={<PostModal />} />
                </Routes>
            </section>
        </main>
    )
}
