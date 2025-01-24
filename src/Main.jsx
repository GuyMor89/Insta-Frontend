import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'

import { Home } from './pages/Home.jsx'
import { SideBar } from './cmps/SideBar.jsx'
import { CreateModal } from './cmps/CreateModal.jsx'
import { PostModal } from './cmps/PostModal.jsx'
import { UserPage } from './pages/UserPage.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { DialogueModal } from './cmps/DialogueModal.jsx'
import { UserModal } from './cmps/UserModal.jsx'
import { HoverTracker } from './cmps/HoverTracker.jsx'
import { MenuModal } from './cmps/MenuModal.jsx'
import { UserBar } from './cmps/UserBar.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { SET_PREV_LOC } from './store/reducers/post.reducer.js'
import { hookService } from './hooks/hook.service.js'

export function Main() {

    const prevLoc = useSelector(storeState => storeState.postModule.prevLoc)

    const { location, dispatch, params, navigate } = hookService()

    function saveRootLocation() {
        const previousLocation = location.state?.previousLocation
        
        const currLocationSegments = location.pathname.split("/")
        const prevLocationSegments = location.state?.previousLocation.split("/")

        if (currLocationSegments[1] !== "p" && !prevLocationSegments) dispatch({ type: SET_PREV_LOC, prevLoc: location.pathname })
        if (currLocationSegments[1] === "p" && !prevLocationSegments?.includes('p')) dispatch({ type: SET_PREV_LOC, prevLoc: previousLocation })
    }

    useEffect(() => {
        saveRootLocation()
    }, [location])

    console.log(prevLoc)
    return (
        <main className='main-app'>
            <LoginSignup />
            <DialogueModal />
            <MenuModal />
            <CreateModal />
            <UserModal />
            <SideBar />
            <section className='main-container'>
                <Routes location={prevLoc || '/'}>
                    <Route path="/" element={<><Home /><UserBar /></>} />
                    <Route path='/:username' element={<UserPage />} />
                </Routes>
                <Routes>
                    <Route path='/p/:id' element={<PostModal />} />
                </Routes>
            </section>
        </main>
    )
}
