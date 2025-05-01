import React, { useEffect, useRef, useState } from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index'
import ChatBox from '../../../components/employee/Chatbox'
import io from 'socket.io-client'
import { Button, Input, Panel, Stack } from 'rsuite'
import { baseUrl } from '../../../API/Api'
import support from '../../../assets/images/support.png'

const socket = io(baseUrl?.slice(0, 22))

const Support = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [targetId, setTargetId] = useState('')
  const messagesEndRef = useRef(null)

  const userID = JSON.parse(localStorage.getItem('user'))
  //   console.log("LOGIN DATA :",userID)

  async function getAllUser() {
    try {
      const req = await fetch(`${baseUrl}/users`)
      const res = await req.json()

      //   console.log('User Data :', res)
      const supportUser = res.data.find(
        (user) => user.role === 'support' && user.team === userID?.teamId,
      )?._id
      console.log('Target user id :', supportUser)
      setTargetId(supportUser)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllUser()
  }, [])

  useEffect(() => {
    const fetchPersonalMessage = async () => {
      try {
        const res = await fetch(`${baseUrl}/dm`)
        if (!res.ok) {
          throw new Error('Failed to fetch messages')
        }
        const data = await res.json()
        setMessages(data.data)
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      }
    }
    fetchPersonalMessage()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    socket.on('privateMessage', (msg) => {
      console.log('Private Msg Received:', msg)

      if (
        (msg.sender._id == userID.id && msg.receiver == targetId) ||
        (msg.sender._id == targetId && msg.receiver == userID.id)
      ) {
        console.log('Me Kaam Kr rha hu')
        setMessages((prev) => [...prev, msg])
      }
    })

    return () => {
      socket.off('privateMessage')
    }
  }, [userID.id, targetId])

  const sendMessage = () => {
    if (input.trim()) {
      const messageObj = {
        sender: userID.id,
        receiver: targetId,
        message: input,
        team: userID.teamId, // optional, for team-based filtering
      }

      socket.emit('privateMessage', messageObj)
      setInput('')
    }
  }
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 p-2">
          <div>
            <Panel bordered style={{ maxWidth: 1400, margin: 'auto' }}>
              <h5 style={{ textAlign: 'center' }}><img src={support} height={40} alt='support-img' /> Support Chat</h5>

              <div
                style={{
                  height: '500px',
                  overflowY: 'auto',
                  border: '1px solid #ddd',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#f9f9f9',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {messages.map((msg, idx) => {
                  const isOwnMessage = msg.sender._id === userID.id
                  return (
                    <div
                      key={idx}
                      style={{
                        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                        backgroundColor: isOwnMessage ? '#beebf6' : '#fff',
                        width: 'fit-content',
                        maxWidth: '70%',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <strong style={{ fontSize: 14, color: '#333' }}>
                        {msg?.sender?.name || 'Anonymous'}
                      </strong>
                      <span style={{ fontSize: 12, color: '#888', marginLeft: 6 }}>
                        ({new Date(msg.createdAt).toLocaleTimeString()})
                      </span>
                      <div style={{ marginTop: '0.5rem', fontSize: 15 }}>{msg.message}</div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <Stack spacing={10}>
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(val) => setInput(val)}
                  onPressEnter={sendMessage}
                />
                <Button appearance="primary" onClick={sendMessage}>
                  Send
                </Button>
              </Stack>
            </Panel>
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default Support
