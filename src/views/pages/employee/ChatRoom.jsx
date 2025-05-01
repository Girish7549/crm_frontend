import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index'

import 'react-toastify/dist/ReactToastify.css'
import ChatBox from '../../../components/employee/Chatbox'

const ChatRoom = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))

  console.log('User Data :', userInfo)

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 p-2">
          <div>
            <ChatBox />
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default ChatRoom
