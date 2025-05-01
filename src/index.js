import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'

import App from './App'
import store from './store'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
    <ToastContainer autoClose={2000} />
  </Provider>
  </BrowserRouter>,
)
