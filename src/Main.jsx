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

export function Main() {

    const location = useLocation()

    const previousLocation = location.state?.previousLocation

    return (
        <main className='main-app'>
            <LoginSignup />
            <DialogueModal />
            <CreateModal />
            <HoverTracker>
                <UserModal />
            </HoverTracker>
            <SideBar />
            <section className='main-container'>
                <Routes location={previousLocation || location}>
                    <Route path="/" element={<Home />} />
                    <Route path='/:username' element={<UserPage />} />
                </Routes>
                <Routes>
                    <Route path='/p/:id' element={<PostModal />} />
                </Routes>
            </section>
        </main>
    )
}
