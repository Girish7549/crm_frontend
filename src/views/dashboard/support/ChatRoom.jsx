import React, { Suspense, useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../../../components/index'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import { CContainer, CSpinner } from '@coreui/react'
// import routes from '../../../routes'
// import WidgetsDropdown from '../../widgets/WidgetsDropdown'
// import { Button, FlexboxGrid, Form, Stack, Tag } from 'rsuite'
// import CheckIcon from '@rsuite/icons/Check'
// import { baseUrl } from '../../../API/Api'

// import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ChatBox from '../../../components/employee/Chatbox'


const ChatRoom = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  // const get_employee_customer = `${baseUrl}/customer`
  // const post_reffered_customer = `${baseUrl}/reffers-customer`

  // const [customer, setCustomer] = useState(null)
  // const [existingCustomer, setExistingCustomer] = useState(null)
  // const [isVerify, setIsVerify] = useState(false)
  // const [refCode, setRefCode] = useState('')

  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  //   address: '',
  //   purchasedService: userInfo?.service._id,
  //   refferedBy: existingCustomer?.[0]._id,
  //   createdBy: userInfo?.id,
  // })

  // function changeHandler(value, event) {
  //   const name = event.target.name
  //   setFormData((prevData) => ({ ...prevData, [name]: value }))
  // }

  // function verifyCode() {
  //   const isVerify = customer.filter((cust) => cust.refferCode === refCode)
  //   if (isVerify.length > 0) {
  //     console.log('Veified :', isVerify)
  //     setExistingCustomer(isVerify)
  //     setFormData((prev) => ({ ...prev, ['refferedBy']: isVerify[0]._id }))
  //     setIsVerify(false)
  //   } else {
  //     setIsVerify(true)
  //   }
  // }

  // async function getAllCustomer() {
  //   try {
  //     const req = await fetch(get_employee_customer)
  //     const res = await req.json()
  //     console.log('Customer Data :', res)
  //     setCustomer(res.data)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // useEffect(() => {
  //   getAllCustomer()
  // }, [])

  // useEffect(() => {
  //   if(refCode === ''){
  //     setExistingCustomer(null)
  //   }
  // },[refCode])

  // async function submitHandler() {
  //   try {
  //     // setLoading(true)
  //     const req = await fetch(post_reffered_customer, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData),
  //       mode: 'cors',
  //     })
  //     const res = await req.json()
  //     // console.log("Response :", res)
  //     if (!res.success) {
  //       toast.error('Already Existed Customer')
  //       getAllCustomer()
  //       setFormData({
  //         name: '',
  //         email: '',
  //         phone: '',
  //         address: '',
  //         purchasedService: userInfo.service._id,
  //         refferedBy: '',
  //         createdBy: userInfo.id,
  //       })
  //       setRefCode('')
  //       setExistingCustomer(null)
  //       // setLoading(false)
  //       return
  //     }
  //     setFormData({
  //       name: '',
  //       email: '',
  //       phone: '',
  //       address: '',
  //       purchasedService: userInfo.service._id,
  //       refferedBy: '',
  //       createdBy: userInfo.id,
  //     })
  //     setRefCode('')
  //     setExistingCustomer(null)
  //     toast.success('Customer Created Successful')
  //     getAllCustomer()
  //     // setLoading(false)
  //   } catch (err) {
  //     console.log(err)
  //     // setLoading(false)
  //   }
  // }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 p-2">
          <div>
            {/* <Stack justifyContent="space-between" spacing={16}>
              <h3>Chat Room 🗨️🧑‍🤝‍🧑</h3>
            </Stack> */}
           <ChatBox />
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default ChatRoom
