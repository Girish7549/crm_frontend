import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

import {
  cilApplications,
  cilBeaker,
  cilApplicationsSettings,
  cilAppsSettings,
  cilAssistiveListeningSystem,
  cilBell,
  cilCalculator,
  cilCalendar,
  cilChartPie,
  cilChatBubble,
  cilControl,
  cilCursor,
  cilDescription,
  cilDollar,
  cilDrop,
  cilExternalLink,
  cilFaceDead,
  cilFactory,
  cilLink,
  cilLinkAlt,
  cilLinkBroken,
  cilNotes,
  cilPencil,
  cilPhone,
  cilPlus,
  cilPuzzle,
  cilSave,
  cilScreenDesktop,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { useAuth } from '../context/AuthContext'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [role, setRole] = useState('')
  const [filteredNav, setFilteredNav] = useState([])
  console.log('Role :', role)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'))
    if (userData && userData.role) {
      console.log('Role from localStorage:', userData.role)
      setRole(userData.role)
    }
  }, [])

  useEffect(() => {
    if (role) {
      const filterNav = _nav[role] || []
      console.log('Filtered Nav:', filterNav)
      setFilteredNav(filterNav)
    }
  }, [role])

  const _nav = {
    admin: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/employee',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      // {
      //   component: CNavTitle,
      //   name: 'Theme',
      // },
      {
        component: CNavItem,
        name: 'Colors',
        to: '/theme/colors',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
    ],
    manager: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/employee',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      // {
      //   component: CNavTitle,
      //   name: 'Theme',
      // },
      {
        component: CNavItem,
        name: 'Colors',
        to: '/theme/colors',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
    ],
    activation: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/activation',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: CNavItem,
        name: 'Sale Activation',
        to: '/active-sale',
        icon: <CIcon icon={cilControl} customClassName="nav-icon" />,
      },

      {
        component: CNavItem,
        name: 'Trial Activation',
        to: '/active-trial',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      },
     
    ],
    support: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/support',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },

      {
        component: CNavItem,
        name: 'Sales',
        to: '/support-all-sales',
        icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
      },

      {
        component: CNavItem,
        name: 'Trial',
        to: '/support-all-trials',
        icon: <CIcon icon={cilBeaker} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Chat Room',
        to: '/support-chat-room',
        icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
      },
    ],
    sales_agent: [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/employee',
        icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
        badge: {
          color: 'info',
          text: 'NEW',
        },
      },
      {
        component: CNavTitle,
        name: 'Authorization',
      },
      {
        component: CNavItem,
        name: 'Customer',
        to: '/create-customer',
        icon: <CIcon icon={cilScreenDesktop} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Reffered',
        to: '/reffered-customer',
        icon: <CIcon icon={cilLink} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Sales',
        to: '/create-sale',
        icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Follow Ups',
        to: '/followUps',
        icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Callback',
        to: '/callback',
        icon: <CIcon icon={cilPhone} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Trial Customer',
        to: '/trial-customer',
        icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Chat Room',
        to: '/chat-room',
        icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Support',
        to: '/support',
        icon: <CIcon icon={cilAssistiveListeningSystem} customClassName="nav-icon" />,
      },
    ],
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={_nav[role]} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
