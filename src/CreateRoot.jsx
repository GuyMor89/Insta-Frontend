import { createRoot } from 'react-dom/client'
import './assets/style/main.scss'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import { Main } from './Main.jsx'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Main />
    </Router>
  </Provider>
)

