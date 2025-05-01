import React, { Suspense , useState, useEffect} from 'react'
import { AppFooter, AppHeader, AppSidebar, AppContent } from '../../../components/index.js'
import WidgetsSupport from './WidgetsSupport.jsx'
import { CContainer, CSpinner } from '@coreui/react'
import { Button, Col, Grid, Modal, Panel, Row, Tag } from 'rsuite'
import {
  ShoppingCart,
  Hourglass,
  AlertTriangle,
  FlaskConical,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { baseUrl } from '../../../API/Api'

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

const SupportDashboard = () => {
  const [dashboard, setDashboard] = useState(null)

  async function dashboardData() {
    try {
      const req = await fetch(`${baseUrl}/activationDashboard`)
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
              <Grid fluid>
                <Row gutter={24}>
                  {/* Active Sales */}
                  <Col xs={24} sm={12} md={8}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#d0f8ce')}>
                        <ShoppingCart size={28} color="#2e7d32" />
                      </div>
                      <Tag color="green" style={{ marginBottom: 8 }}>
                        Live
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.sale_live_count}</h2>
                      <p style={labelStyle}>Active Sales</p>
                    </Panel>
                  </Col>

                  {/* Pending Sales */}
                  <Col xs={24} sm={12} md={8}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#fff3e0')}>
                        <Hourglass size={28} color="#ef6c00" />
                      </div>
                      <Tag color="orange" style={{ marginBottom: 8 }}>
                        Pending
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.sale_pending_count}</h2>
                      <p style={labelStyle}>Pending Sales</p>
                    </Panel>
                  </Col>

                  {/* Expiring Sales */}
                  <Col xs={24} sm={12} md={8}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#ffebee')}>
                        <AlertTriangle size={28} color="#d32f2f" />
                      </div>
                      <Tag color="red" style={{ marginBottom: 8 }}>
                        Expiring Soon
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.sale_expiredSoon_count}</h2>
                      <p style={labelStyle}>Sales Near Expiry</p>
                    </Panel>
                  </Col>

                  {/* Active Trials */}
                  <Col xs={24} sm={12} md={8}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#e3f2fd')}>
                        <FlaskConical size={28} color="#1976d2" />
                      </div>
                      <Tag color="blue" style={{ marginBottom: 8 }}>
                        Live
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.trial_live_count}</h2>
                      <p style={labelStyle}>Active Trials</p>
                    </Panel>
                  </Col>

                  {/* Pending Trials */}
                  <Col xs={24} sm={12} md={8}>
                    <Panel bordered style={cardStyle}>
                      <div style={iconWrapper('#fffde7')}>
                        <Clock size={28} color="#fbc02d" />
                      </div>
                      <Tag color="yellow" style={{ marginBottom: 8 }}>
                        Pending
                      </Tag>
                      <h2 style={valueStyle}>{dashboard?.trial_pending_count}</h2>
                      <p style={labelStyle}>Pending Trials</p>
                    </Panel>
                  </Col>

                  {/* Expiring Trials */}
                  <Col xs={24} sm={12} md={8}>
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
                  </Col>
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

export default SupportDashboard
