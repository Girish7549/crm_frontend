import React, { Suspense, useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../../../components/index'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import routes from '../../../routes'
import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import { Button, FlexboxGrid, Form, Stack, Tag } from 'rsuite'
import CheckIcon from '@rsuite/icons/Check'
import { baseUrl } from '../../../API/Api'
import reffer from '../../../assets/images/reffer.png'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Reffered = () => {
  const userInfo = JSON.parse(localStorage.getItem('user'))
  const get_employee_customer = `${baseUrl}/customer`
  const post_reffered_customer = `${baseUrl}/reffers-customer`

  console.log('User Data :', userInfo)

  const [customer, setCustomer] = useState(null)
  const [existingCustomer, setExistingCustomer] = useState(null)
  const [isVerify, setIsVerify] = useState(false)
  const [refCode, setRefCode] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    purchasedService: userInfo?.service?._id,
    refferedBy: existingCustomer?.[0]._id,
    createdBy: userInfo?.id,
  })
  console.log('Form Data :', formData)

  function changeHandler(value, event) {
    const name = event.target.name
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  function verifyCode() {
    const isVerify = customer.filter((cust) => cust.refferCode === refCode)
    if (isVerify.length > 0) {
      console.log('Veified :', isVerify)
      setExistingCustomer(isVerify)
      setFormData((prev) => ({ ...prev, ['refferedBy']: isVerify[0]._id }))
      setIsVerify(false)
    } else {
      setIsVerify(true)
    }
  }

  async function getAllCustomer() {
    try {
      const req = await fetch(get_employee_customer)
      const res = await req.json()
      console.log('Customer Data :', res)
      setCustomer(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllCustomer()
  }, [])

  useEffect(() => {
    if(refCode === ''){
      setExistingCustomer(null)
    }
  },[refCode])

  async function submitHandler() {
    try {
      // setLoading(true)
      const req = await fetch(post_reffered_customer, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        mode: 'cors',
      })
      const res = await req.json()
      // console.log("Response :", res)
      if (!res.success) {
        toast.error('Already Existed Customer')
        getAllCustomer()
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          purchasedService: userInfo.service._id,
          refferedBy: '',
          createdBy: userInfo.id,
        })
        setRefCode('')
        setExistingCustomer(null)
        // setLoading(false)
        return
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        purchasedService: userInfo.service._id,
        refferedBy: '',
        createdBy: userInfo.id,
      })
      setRefCode('')
      setExistingCustomer(null)
      toast.success('Customer Created Successful')
      getAllCustomer()
      // setLoading(false)
    } catch (err) {
      console.log(err)
      // setLoading(false)
    }
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 p-2">
          <div>
            <Stack justifyContent="space-between" spacing={16}>
              <h3><img src={reffer} height={50} alt='reffer-img' /> Reffered Customer</h3>
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="column"
              style={{ gap: '1rem' }}
            >
              <Form layout="horizontal" style={{ display: 'flex', flexDirection: 'column' }}>
                <Form.Group controlId="name-6">
                  <Form.ControlLabel>Name</Form.ControlLabel>
                  <Form.Control
                    name="name"
                    required
                    value={formData.name}
                    onChange={changeHandler}
                  />
                  {/* <Form.HelpText>Required</Form.HelpText> */}
                </Form.Group>
                <Form.Group controlId="email-6">
                  <Form.ControlLabel>Email</Form.ControlLabel>
                  <Form.Control
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={changeHandler}
                  />
                  {/* <Form.HelpText tooltip>Required</Form.HelpText> */}
                </Form.Group>
                <Form.Group controlId="password-6">
                  <Form.ControlLabel>Phone</Form.ControlLabel>
                  <Form.Control
                    name="phone"
                    type="number"
                    required
                    value={formData.phone}
                    onChange={changeHandler}
                  />
                </Form.Group>
                <Form.Group controlId="textarea-6">
                  <Form.ControlLabel>Address</Form.ControlLabel>
                  <Form.Control
                    name="address"
                    rows={5}
                    required
                    value={formData.address}
                    onChange={changeHandler}
                  />
                </Form.Group>
                <Form.Group controlId="textarea-6">
                  <Form.ControlLabel>Reffered Code</Form.ControlLabel>
                  <Form.Control
                    name="refferedBy"
                    rows={5}
                    required
                    value={refCode}
                    onChange={(value) => setRefCode(value)}
                  />
                  {!existingCustomer && (
                    <Button style={{ marginLeft: '1rem' }} appearance="ghost" onClick={verifyCode}>
                      Apply
                    </Button>
                  )}
                  {isVerify && <p style={{ color: 'red' }}>Invalid Refferal Code</p>}
                  {existingCustomer &&  (
                    <Button style={{ marginLeft: '1rem' }} appearance="ghost" color="green">
                      Applied
                    </Button>
                  )}
                </Form.Group>
              </Form>
              <Button appearance="primary" name="submit" onClick={submitHandler}>
                Create Cusotmer
              </Button>
              {existingCustomer && (
                <FlexboxGrid
                  justify="center
                                  "
                  align="center"
                  style={{ flexWrap: 'wrap' }}
                >
                  <FlexboxGrid.Item
                    colspan={6}
                    style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Tag color="blue">Customer Name:</Tag>
                    {/* <br /> */}
                    <span style={{ fontWeight: 'bold' }}>{existingCustomer?.[0].name}</span>
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item
                    colspan={6}
                    style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Tag color="cyan">Email:</Tag>
                    {/* <br /> */}
                    <span style={{ fontWeight: 'bold' }}>{existingCustomer?.[0].email}</span>
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item
                    colspan={6}
                    style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Tag color="green">Phone No:</Tag>
                    {/* <br /> */}
                    <span style={{ fontWeight: 'bold' }}>{existingCustomer?.[0].phone}</span>
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item
                    colspan={6}
                    style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Tag color="orange">Address:</Tag>
                    {/* <br /> */}
                    <span style={{ fontWeight: 'bold' }}>{existingCustomer?.[0].address}</span>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              )}
            </Stack>
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default Reffered
