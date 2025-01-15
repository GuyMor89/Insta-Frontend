import { createRoot } from 'react-dom/client'
import './assets/style/main.scss'

import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { store } from './store/store.js'
import { Home } from './pages/Home.jsx'
import { SideBar } from './cmps/SideBar.jsx'
import { CreateModal } from './cmps/CreateModal.jsx'
import { PostModal } from './cmps/PostModal.jsx'
import { UserPage } from './pages/UserPage.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      {/* <UserMsg /> */}
      <main className='main-app'>
        <LoginSignup />
        <CreateModal />
        <SideBar />
        <section className='main-container'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/p/:id' element={<><Home /> <PostModal /></>} />
            <Route path='/:username' element={<><UserPage /> <PostModal /></>} />
          </Routes>
        </section>
      </main>
    </Router>
  </Provider>
)