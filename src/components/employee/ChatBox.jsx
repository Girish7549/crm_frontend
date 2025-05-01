import React, { useState, useRef, useEffect } from 'react'
import { Input, Button, Panel, Stack } from 'rsuite'
import io from 'socket.io-client'
import axios from 'axios'
import { baseUrl } from '../../API/Api'
import chatImg from '../../assets/images/group.png'

const socket = io(baseUrl?.slice(0,22))

const ChatBox = () => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const messagesEndRef = useRef(null)
  const userID = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${baseUrl}/chats`)
        if (!res.ok) {
          throw new Error('Failed to fetch messages')
        }
        const data = await res.json()
        setMessages(data.data)
      } catch (err) {
        console.error('Failed to fetch messages:', err)
      }
    }
    fetchMessages()
  }, [])

  useEffect(() => {
    socket.on('chatMessage', (newMsg) => {
      setMessages((prev) => [...prev, newMsg])
    })

    return () => {
      socket.off('chatMessage')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (text.trim() === '') return

    const message = {
      sender: userID.id,
      content: text,
    }

    socket.emit('chatMessage', message)
    setText('')
  }

  console.log('Message : ', messages)

  return (
    <Panel bordered style={{ maxWidth: 1400, margin: 'auto' }}>
      <h5 style={{ textAlign: 'center',}}><img src={chatImg} height={40} alt='chat-img' /> Chat Room</h5>

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
                ({new Date(msg.sentAt).toLocaleTimeString()})
              </span>
              <div style={{ marginTop: '0.5rem', fontSize: 15 }}>{msg.content}</div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <Stack spacing={10}>
        <Input
          placeholder="Type your message..."
          value={text}
          onChange={(val) => setText(val)}
          onPressEnter={handleSend}
        />
        <Button appearance="primary" onClick={handleSend}>
          Send
        </Button>
      </Stack>
    </Panel>
  )
}

export default ChatBox
