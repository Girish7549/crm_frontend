import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
import ProtectedRoute from './ProtectedRoute'
import Sale from './views/pages/employee/Sale'
import FollowUps from './views/pages/employee/FollowUps'
import Reffered from './views/pages/employee/Reffered'
import Callback from './views/pages/employee/Callback'
import TrialCustomer from './views/pages/employee/TrialCustomer'
import ChatRoom from './views/pages/employee/ChatRoom'
import Support from './views/pages/employee/Support'
import SaleActivation from './views/pages/activation/SaleActivation'
import TrialActivation from './views/pages/activation/TrialActivation'
import CallbackChecker from './components/employee/CallbackChecker'
// import SupportDashboard from './views/dashboard/support/SupportDashboard'
// import AllSales from './views/dashboard/support/AllSales'
// import AllTrials from './views/dashboard/support/AllTrials'
// import SupportChatRoom from './views/dashboard/support/ChatRoom'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Employee Pages
const EmpDashboard = React.lazy(() => import('./views/dashboard/employee/DefaultLayout'))
const ActivationDashboard = React.lazy(() => import('./views/dashboard/activation/DefaultLayout'))
const Customer = React.lazy(() => import('./views/theme/colors/Colors'))

// Support Pages
const SupportDashboard = React.lazy(() => import('./views/dashboard/support/SupportDashboard'))
const AllSales = React.lazy(() => import('./views/dashboard/support/AllSales'))
const AllTrials = React.lazy(() => import('./views/dashboard/support/AllTrials'))
const SupportChatRoom = React.lazy(() => import('./views/dashboard/support/ChatRoom'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Rsuit = React.lazy(() => import('./'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  // const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      {/* <CallbackChecker /> */}
      <Routes>
        {/* <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
        }
        {/* Redirect index to login */}
        {/* <Route path="*" name="Home" element={<DefaultLayout />} />   */}
        <Route exact index path="/" name="Login Page" element={<Login />} />
        {/* Login Route */}
        {/* <Route path="/authentication/sign-in" element={<SignIn />} /> */}
        {/* Sales Person Route */}
        <Route element={<ProtectedRoute allowedRoles={['sales_agent']} />}>
          <Route path="/employee/*" element={<EmpDashboard />} />
          <Route path="/create-customer" element={<Customer />} />
          <Route path="/reffered-customer" element={<Reffered />} />
          <Route path="/create-sale" element={<Sale />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/followUps" element={<FollowUps />} />
          <Route path="/trial-customer" element={<TrialCustomer />} />
          <Route path="/chat-room" element={<ChatRoom />} />
          <Route path="/support" element={<Support />} />
          {/* <Route path="/create-sale" element={<Billing />} />
          <Route path="/new" element={<Sale />} /> */}
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['support']} />}>
          <Route index path="/support/*" element={<SupportDashboard />} />
          <Route path="/support-all-sales" element={<AllSales />} />
          <Route path="/support-all-trials" element={<AllTrials />} />
          <Route path="/support-chat-room" element={<SupportChatRoom />} />
        </Route>

        {/* Activation Person Route */}
        <Route element={<ProtectedRoute allowedRoles={['activation']} />}>
          <Route path="/activation/*" element={<ActivationDashboard />} />
          <Route path="/active-sale" element={<SaleActivation />} />
          <Route path="/active-trial" element={<TrialActivation />} />
        </Route>
        {/* Manager Route */}
        {/* <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="/manager" element={<Dashboard_Manger />} />
          </Route> */}
        {/* Unauthorized Page */}
        {/* <Route path="/unauthorized" element={<SignIn />} />    */}
      </Routes>
    </Suspense>
  )
}

export default App
