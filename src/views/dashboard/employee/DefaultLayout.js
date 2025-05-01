import React, { Suspense, useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../../../components/index'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import routes from '../../../routes'
import WidgetsDropdown from '../../widgets/WidgetsDropdown'
import { baseUrl } from '../../../API/Api'

import { Button, Col, Grid, Modal, Panel, Row, Tag } from 'rsuite'
import {
  Hourglass,
  AlertTriangle,
  FlaskConical,
  Clock,
  AlertCircle,
  BanknoteX,
  CircleDollarSign,
  Headset,
  PhoneOutgoing,
} from 'lucide-react'

const cardStyle = {
  width: '100%',
  minHeight: 180,
  textAlign: 'center',
  padding: 0,
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  backgroundColor: '#fff',
}

const iconWrapper = (bgColor = '#e3f2fd') => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 60,
  width: 60,
  margin: '0 auto 12px',
  borderRadius: '50%',
  backgroundColor: bgColor,
})

const valueStyle = {
  margin: '4px 0',
  fontSize: '2rem',
  fontWeight: 600,
}

const labelStyle = {
  margin: 0,
  fontSize: '1rem',
  color: '#333',
  fontWeight: 500,
}

const DefaultLayout = () => {
  const userID = JSON.parse(localStorage.getItem('user'))
  let url = `${baseUrl}/user/${userID.id}`
  let user_sale_url = `${baseUrl}/sales/employee/${userID.id}`
  let user_follow_url = `${baseUrl}/followUps/employee/${userID.id}`
  // console.log('user_sale_url : ', user_sale_url)
  // console.log('user_follow_url : ', user_follow_url)

  const [user, setUser] = useState(null)
  const [totalSale, setTotalSale] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [pendingPayment, setPendingPayment] = useState(0)
  const [followUpToday, setFollowUpToday] = useState(0)
  const [followUpTotal, setFollowUpTotal] = useState(0)
  const [notification, setNotification] = useState([])
  const [dashboard, setDashboard] = useState(null)

  const data = { user, totalSale, totalRevenue, pendingPayment, followUpToday, followUpTotal }

  async function getUser() {
    const request = await fetch(url)
    const response = await request.json()
    const user_sale = await fetch(user_sale_url)
    const response_sale = await user_sale.json()
    const followUpsReq = await fetch(user_follow_url)
    const followUpsRes = await followUpsReq.json()
    // console.log("User Data :", response);
    // console.log("User Sales :", response_sale);
    // console.log("User FollowUps :", followUpsRes);
    const today = new Date()
    const todayFollowUps = followUpsRes?.followUp?.filter(
      (follow) => follow.followUpDate.split('T')[0] === today.toISOString().split('T')[0],
    )
    console.log('Today Follow Ups :', todayFollowUps)
    setFollowUpToday(todayFollowUps?.length)
    setFollowUpTotal(followUpsRes?.followUp?.length)
    // const totalRevenue = response_sale.data.filter((sale) => sale.status === "completed");
    // console.log("Completed sale :", totalRevenue);

    const totalRevenue = response_sale.data
      .filter((sale) => sale.status === 'completed')
      .reduce((total, sale) => {
        const saleTotal = sale.saleItems.reduce((sum, item) => sum + item.amount, 0)
        return total + saleTotal
      }, 0)
    const pendingPayment = response_sale.data
      .filter((sale) => sale.status === 'pending')
      .reduce((total, sale) => {
        const saleTotal = sale.saleItems.reduce((sum, item) => sum + item.amount, 0)
        return total + saleTotal
      }, 0)
    setUser(response.data)
    setTotalSale(response_sale.data.length)
    setTotalRevenue(totalRevenue)
    setPendingPayment(pendingPayment)
  }
  useEffect(() => {
    getUser()
  }, [])

  async function dashboardData() {
    try {
      const req = await fetch(`${baseUrl}/saleDashboard/${userID.id}`)
      const res = await req.json()
      setDashboard(res.data)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    dashboardData()
  }, [])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CContainer className="px-4" lg>
            <Suspense fallback={<CSpinner color="primary" />}>
              {/* <WidgetsDropdown className="mb-4" data={data} /> */}
              <Grid fluid>
                <Row gutter={24}>
                  {/* Active Sales */}
                  <Col xs={24} sm={12} md={8} style={{ marginTop: '8px' }}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#d0f8ce')}>
                        <CircleDollarSign size={28} color="#2e7d32" />
                      </div>
                      <Tag color="green" style={{ marginBottom: 8 }}>
                        Total
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.monthly_sale}</h2>
                      <p style={labelStyle}>Monthly Sale</p>
                    </Panel>
                  </Col>

                  {/* Pending Sales */}
                  <Col xs={24} sm={12} md={8} style={{ marginTop: '8px' }}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#fff3e0')}>
                        <BanknoteX size={28} color="#ef6c00" />
                      </div>
                      <Tag color="orange" style={{ marginBottom: 8 }}>
                        Pending
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.pending_payment}</h2>
                      <p style={labelStyle}>Pending Payment</p>
                    </Panel>
                  </Col>

                  {/* Expiring Sales */}
                  <Col xs={24} sm={12} md={8} style={{ marginTop: '8px' }}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#f3e9fb')}>
                        <Headset size={28} color="#953bdc" />
                      </div>
                      <Tag color="violet" style={{ marginBottom: 8 }}>
                        Today
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.follow_ups_today}</h2>
                      <p style={labelStyle}>Follow-Ups</p>
                    </Panel>
                  </Col>

                  {/* Active Trials */}
                  <Col xs={24} sm={12} md={8} style={{ marginTop: '8px' }}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#e3f2fd')}>
                        <PhoneOutgoing size={28} color="#1976d2" />
                      </div>
                      <Tag color="blue" style={{ marginBottom: 8 }}>
                        Today
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.callback_today}</h2>
                      <p style={labelStyle}>Callback </p>
                    </Panel>
                  </Col>

                  {/* Pending Trials */}
                  <Col xs={24} sm={12} md={8} style={{ marginTop: '8px' }}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#fffde7')}>
                        <Clock size={28} color="#fbc02d" />
                      </div>
                      <Tag color="yellow" style={{ marginBottom: 8 }}>
                        Pending
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.trial_pending}</h2>
                      <p style={labelStyle}>Pending Trials</p>
                    </Panel>
                  </Col>

                  {/* Expiring Trials */}
                  {/* <Col xs={24} sm={12} md={8}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#fce4ec')}>
                        <AlertCircle size={28} color="#c2185b" />
                      </div>
                      <Tag color="red" style={{ marginBottom: 8 }}>
                        Expiring Soon
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.trial_expiredSoon_count}</h2>
                      <p style={labelStyle}>Trials Near Expiry</p>
                    </Panel>
                  </Col> */}
                </Row>
              </Grid>
            </Suspense>
          </CContainer>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
