import { createRoot } from 'react-dom/client'
import './assets/style/main.scss'

import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

// import { store } from './store/store.js'
import { Home } from './pages/Home.jsx'
import { SideBar } from './cmps/SideBar.jsx'

createRoot(document.getElementById('root')).render(
  // <Provider store={store}>
  <Router>
    {/* <UserMsg /> */}
    <main className='main-app'>
      <SideBar />
      <section className='main-container'>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </section>
    </main>
  </Router>
  // </Provider>
)