import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import coinIcon from '../assets/images/coin.png'

import { useState } from 'react'
import { Modal, Button, Badge, Input, PanelGroup, Panel, DatePicker } from 'rsuite'
import { baseUrl } from '../API/Api'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const [notification, setNotification] = useState([])
  const userID = JSON.parse(localStorage.getItem('user'))

  const coin = useSelector((state) => state.coin || 0)
  const dispatch = useDispatch()

  // Modal fucntion and States
  const [open, setOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  // const [coins, setCoins] = useState(0)

  async function getNotification() {
    const req = await fetch(`${baseUrl}/notification/employee/${userID.id}`)
    const res = await req.json()
    setNotification(res.data)
    console.log('Notifiation data :', res)
  }
  // console.log('Trial Count  :', coin)
  // async function userInfo() {
  //   const req = await fetch(`${baseUrl}/user/${userID.id}`)
  //   const res = await req.json()
  //   setCoins(res.data.trialCount)
  //   dispatch({ type: 'setCoin', payload: res.data.trialCount })

  //   // console.log('Trial Count  :', res.data.trialCount)
  // }
  useEffect(() => {
    getNotification()
    // userInfo()
  }, [])
  const removeAlertedCallback = (callbackId) => {
    const alerted = JSON.parse(localStorage.getItem('alertedCallbacks') || '[]')
    const updated = alerted.filter(id => id !== callbackId)
    localStorage.setItem('alertedCallbacks', JSON.stringify(updated))
  }
  

  const handleReply = async (callbackId, notificationId) => {
    try {
      const req = await fetch(`${baseUrl}/callback/${callbackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: [
            {
              note: replyText,
            },
          ],
          scheduledTime: selectedDate,
          notification: notificationId,
        }),
      })
      console.log('Message : ', replyText)
      setReplyText('')
      getNotification()
      setOpen(false)
      removeAlertedCallback(callbackId)
      window.location.reload()
    } catch (err) {
      console.error('Error posting notification:', err)
    }
  }
  const notInterestedHandler = async (callbackId, notificationId) => {
    try {
      const req = await fetch(`${baseUrl}/callback/${callbackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: [
            {
              note: replyText,
            },
          ],
          scheduledTime: Date.now(),
          status: 'notInterested',
          notification: notificationId,
        }),
      })
      console.log('Message : ', replyText)
      setReplyText('')
    } catch (err) {
      console.error('Error posting notification:', err)
    }
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#" style={{ position: 'relative' }} onClick={() => setOpen(true)}>
              <Badge content={`${notification?.length}`}>
                <CIcon icon={cilBell} size="lg" />
              </Badge>
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
          {userID?.role === 'sales_agent' && (
            <CNavItem>
              <CNavLink href="#">
                <Badge content={coin} color="gold" style={{ fontSize: '0.75rem' }}>
                  <img src={coinIcon} alt="Coins" style={{ width: '20px', height: '20px' }} />
                </Badge>
              </CNavLink>
            </CNavItem>
          )}
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>

      <Modal open={open} onClose={() => setOpen(false)} size="md" className="rounded-xl">
        <Modal.Header>
          <Modal.Title>🔔 Notification </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {notification?.length === 0 ? (
            <>
              <h5>📭 No Notifications</h5>
              <p>You're all caught up. Check back later for updates.</p>
            </>
          ) : (
            <>
              {notification.map((item) => (
                <div key={item._id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <p style={{ marginBottom: '1rem' }}>
                      <strong>Customer</strong> :{' '}
                      <span style={{ color: '#09a688' }}>{item?.title}</span>
                    </p>
                    <p style={{ marginBottom: '1.4rem', color: '#296fb7' }}>
                      {' '}
                      {new Date(item.createdAt).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>

                  <Panel header="📞 Add Call Update" collapsible>
                    <Input
                      as="textarea"
                      rows={3}
                      placeholder="Write your call update here..."
                      value={replyText}
                      onChange={setReplyText}
                    />

                    <div
                      style={{
                        marginTop: '10px',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                      }}
                    >
                      <label style={{ whiteSpace: 'nowrap' }}>📅 Select Date:</label>
                      <DatePicker
                        style={{ flex: 1 }}
                        format="dd MMM yyyy hh:mm:ss aa"
                        placeholder="Pick a next calling date"
                        oneTap
                        value={selectedDate}
                        onChange={setSelectedDate}
                      />
                      <Button
                        appearance="primary"
                        color="red"
                        onClick={() => notInterestedHandler(item.callback._id, item._id)}
                      >
                        Not Interested
                      </Button>
                    </div>

                    <Button
                      appearance="primary"
                      style={{ marginTop: '10px' }}
                      onClick={() => handleReply(item.callback._id, item._id)}
                      block
                    >
                      Submit Reply
                    </Button>
                  </Panel>
                </div>
              ))}
            </>
          )}
        </Modal.Body>
      </Modal>
    </CHeader>
  )
}

export default AppHeader
