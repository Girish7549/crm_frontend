import React, { useEffect, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import { AppFooter, AppHeader, AppSidebar } from '../../../components'
import { ButtonToolbar, Form, Pagination, Placeholder, SelectPicker } from 'rsuite'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { baseUrl } from '../../../API/Api.js'
// Rsuite Components
import { Button, Stack } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import trialImg from '../../../assets/images/trial.png'

const ThemeView = () => {
  const [color, setColor] = useState('rgb(255, 255, 255)')
  const ref = createRef()

  useEffect(() => {
    const el = ref.current.parentNode.firstChild
    const varColor = window.getComputedStyle(el).getPropertyValue('background-color')
    setColor(varColor)
  }, [ref])

  return (
    <table className="table w-100" ref={ref}>
      <tbody>
        <tr>
          <td className="text-body-secondary">HEX:</td>
          <td className="font-weight-bold">{rgbToHex(color)}</td>
        </tr>
        <tr>
          <td className="text-body-secondary">RGB:</td>
          <td className="font-weight-bold">{color}</td>
        </tr>
      </tbody>
    </table>
  )
}

const ThemeColor = ({ className, children }) => {
  const classes = classNames(className, 'theme-color w-75 rounded mb-3')
  return (
    <CCol xs={12} sm={6} md={4} xl={2} className="mb-4">
      <div className={classes} style={{ paddingTop: '75%' }}></div>
      {children}
      <ThemeView />
    </CCol>
  )
}

ThemeColor.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

import { Table, Toggle, TagPicker, VStack, HStack } from 'rsuite'
import { Modal } from 'rsuite'
import Loader from '../../../components/loader/Loader.js'
import { useDispatch } from 'react-redux'
import LiveTimmerCell from '../../../components/employee/LiveTimmer.jsx'
import OneHourTimerCell from '../../../components/employee/OneHourTimerCell.jsx'
import LiveTimerCell from '../../../components/employee/LiveTimer.jsx'

// import { mockUsers } from '../../../data/mock';

const { Column, HeaderCell, Cell } = Table
// const data = mockUsers(20);

const CompactCell = (props) => <Cell {...props} style={{ padding: 4 }} />
const CompactHeaderCell = (props) => <HeaderCell {...props} style={{ padding: 4 }} />

const defaultColumns = [
  {
    key: '_id',
    label: 'Customer Id',
    fixed: true,
    width: 250,
  },
  {
    key: 'name',
    label: 'Customer Name',
    fixed: true,
    width: 250,
  },
  {
    key: 'email',
    label: 'Email',
    width: 300,
  },
  {
    key: 'phone',
    label: 'Contact No.',
    width: 180,
  },

  {
    key: 'address',
    label: 'Address',
    width: 320,
  },
  {
    key: 'status',
    label: 'Status',
    width: 220,
  },
  {
    key: 'validation',
    label: 'Expired At',
    width: 120,
  },

  {
    key: 'action',
    label: 'Action',
    align: 'center',
    width: 135,
  },
]

const plans = [
  { label: 'Gold', value: 'gold' },
  { label: 'Platinum', value: 'platinum' },
  { label: 'Diamond', value: 'diamond' },
]

const StatusCell = ({ rowData, dataKey, ...props }) => {
  const status = rowData[dataKey]?.toLowerCase() || ''

  const isPending = status === 'pending'
  const isActive = status === 'active'
  const isCompleted = status === 'done'

  const style = {
    backgroundColor: isPending
      ? '#fff3cd'
      : isCompleted
        ? '#d4edda'
        : isActive
          ? '#e2e3f3'
          : '#f8d7da',
    color: isPending ? '#856404' : isCompleted ? '#155724' : isActive ? '#4b0082' : '#721c24',
    borderRadius: 8,
    padding: '2px 8px',
    marginTop: '-0.5rem',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: 100,
    fontWeight: 500,
  }

  return (
    <Cell {...props}>
      <span style={style}>{status}</span>
    </Cell>
  )
}

const TrialCustomer = () => {
  const [compact, setCompact] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [showHeader, setShowHeader] = React.useState(true)
  const [hover, setHover] = React.useState(true)
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key))

  const columns = defaultColumns.filter((column) => columnKeys.some((key) => key === column.key))
  const CustomCell = compact ? CompactCell : Cell
  const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell

  const userID = JSON.parse(localStorage.getItem('user'))

  const trial_url = `${baseUrl}/trial`
  const get_employee_customer = `${baseUrl}/customer/employee/${userID.id}`
  const get_trial_employee = `${baseUrl}/trial/employee/${userID.id}`

  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState([])
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [filterCustomers, setFilterCustomers] = useState([])

  const userString = localStorage.getItem('user')

  const dispatch = useDispatch()

  useEffect(() => {
    const filtered = customer.filter((cust) => cust.status === 'trial')
    setFilterCustomers(filtered)
  }, [customer])

  console.log('Trial Customer', filterCustomers)

  async function getAllTrialCustomer() {
    try {
      const req = await fetch(get_trial_employee)
      const res = await req.json()
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  async function getAllEmpCustomer() {
    try {
      const req = await fetch(get_employee_customer)
      const res = await req.json()
      setCustomer(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  setTimeout(() => {
    getAllTrialCustomer()
  }, 120000)

  useEffect(() => {
    getAllTrialCustomer()
    getAllEmpCustomer()
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: userID?.service?._id,
    plan: '',
    device: '',
    assignedEmployee: userID?.id,
  })

  const handleOpen = (value) => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  async function submitHandler() {
    // Validation: Check required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.plan ||
      !formData.device
    ) {
      toast.warning('Please select customer, plan & device')
      return
    }

    try {
      setLoading(true)

      const req = await fetch(trial_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        mode: 'cors',
      })
      const res = await req.json()
      console.log('Resopnse :', res)
      if (res.message == 'Employee already has a pending trial for today') {
        toast.warning('You already has a pending trial for today')
      } else if (res.message == 'Already Existing Customer') {
        toast.error('Already Existing Customer')
      } else {
        toast.success('Trial Created Successfully')
        const user = JSON.parse(userString)
        user.trialCount = user.trialCount - 1
        localStorage.setItem('user', JSON.stringify(user))
        console.log('trialCount updated!')
        dispatch({ type: 'decrementCoin' })
      }

      // Reset form fields after success
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        service: userID?.service?._id,
        plan: '',
        device: '',
        assignedEmployee: userID?.id,
      })
      // if (userString) {
      //   const user = JSON.parse(userString)

      //   user.trialCount = user.trialCount - 1

      //   localStorage.setItem('user', JSON.stringify(user))

      //   console.log('trialCount updated!')
      // } else {
      //   console.warn('No user data found in localStorage.')
      // }

      handleClose()
      getAllTrialCustomer()
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1 p-2">
            {/* <AppContent /> */}
            {/* <h1>Create Customer </h1> */}
            <div>
              <Stack justifyContent="space-between" spacing={16}>
                <h3>
                  <img src={trialImg} height={50} alt="trial-image" /> Trial-Customers List{' '}
                </h3>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <TagPicker
                    data={defaultColumns}
                    labelKey="label"
                    valueKey="key"
                    value={columnKeys}
                    onChange={setColumnKeys}
                    cleanable={false}
                  />
                  <Button appearance="primary" onClick={handleOpen}>
                    Create Trial
                  </Button>
                </div>
              </Stack>
              <hr />

              <Table
                height={300}
                hover={hover}
                showHeader={showHeader}
                data={data}
                bordered={bordered}
                cellBordered={bordered}
                headerHeight={compact ? 30 : 40}
                rowHeight={compact ? 30 : 46}
              >
                {/* {columnKeys.includes('_id') && (
                  <Column key="_id" width={200} fixed>
                    <HeaderCell>Customer ID</HeaderCell>
                    <Cell dataKey="customer._id" style={{ padding: '4px 10px' }} />
                  </Column>
                )} */}
                {columnKeys.includes('name') && (
                  <Column key="name" width={200} fixed>
                    <HeaderCell>🧑 Customer Name</HeaderCell>
                    <Cell dataKey="name" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('email') && (
                  <Column key="email" width={250} fixed>
                    <HeaderCell>📧 Email</HeaderCell>
                    <Cell dataKey="email" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('phone') && (
                  <Column key="phone" width={180} fixed>
                    <HeaderCell>📞 Contact No.</HeaderCell>
                    <Cell dataKey="phone" style={{ padding: '4px 10px' }} />
                  </Column>
                )}

                {columnKeys.includes('address') && (
                  <Column key="address" width={250} fixed>
                    <HeaderCell>📍 Address</HeaderCell>
                    <Cell dataKey="address" style={{ padding: '4px 10px' }} />
                  </Column>
                )}

                {columnKeys.includes('address') && (
                  <Column key="address" width={120} fixed>
                    <HeaderCell>🧾 Plan</HeaderCell>
                    <Cell dataKey="plan" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('address') && (
                  <Column key="address" width={120} fixed>
                    <HeaderCell>📱 Device</HeaderCell>
                    <Cell dataKey="device" style={{ padding: '4px 10px' }} />
                  </Column>
                )}

                {columnKeys.includes('status') && (
                  <Column key="status" width={120} fixed align="center">
                    <HeaderCell>📊 Status</HeaderCell>
                    <StatusCell dataKey="status" style={{ padding: '10px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('validation') && (
                  <Column key="validation" width={200} align="center" fixed>
                    <HeaderCell>⏰ Time Left</HeaderCell>
                    <LiveTimmerCell dataKey="validation" />
                  </Column>
                )}
              </Table>

              <div style={{ padding: 20 }}>
                <Pagination
                  prev
                  next
                  first
                  last
                  ellipsis
                  boundaryLinks
                  maxButtons={5}
                  size="xs"
                  layout={['total', '-', '|', 'pager']}
                  limit={20}
                  total={data?.length}
                  activePage={page}
                  onChangePage={setPage}
                />
              </div>
            </div>
          </div>
          <AppFooter />
        </div>

        {/* Create Trial Modal */}
        <Modal backdrop="static" size="sm" open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>Create Trial</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form fluid>
              {/* Customer Selection */}
              <Form.Group style={{ width: '100%' }}>
                <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                  Customer Name 🧑
                </Form.ControlLabel>
                <Form.Control
                  name="name"
                  placeholder="Enter Customer Name"
                  required
                  value={formData.name}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: value,
                    }))
                  }
                />
              </Form.Group>
              {/* Email Selection */}
              <Form.Group style={{ width: '100%' }}>
                <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                  Email 📧
                </Form.ControlLabel>
                <Form.Control
                  name="email"
                  placeholder="Enter Your Mail "
                  required
                  value={formData.email}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: value,
                    }))
                  }
                />
              </Form.Group>
              {/* Phone Selection */}
              <Form.Group style={{ width: '100%' }}>
                <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                  Phone 📞
                </Form.ControlLabel>
                <Form.Control
                  name="phone"
                  placeholder="Enter Your Phone Number"
                  required
                  value={formData.phone}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: value,
                    }))
                  }
                />
              </Form.Group>
              {/* Address Selection */}
              <Form.Group style={{ width: '100%' }}>
                <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                  Address 📍
                </Form.ControlLabel>
                <Form.Control
                  name="address"
                  placeholder="Enter Your Address"
                  required
                  value={formData.address}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: value,
                    }))
                  }
                />
              </Form.Group>

              {/* Plan Selection */}
              <Form.Group>
                <Form.ControlLabel style={{ textAlign: 'left' }}>Choose Plan 🧾</Form.ControlLabel>
                <SelectPicker
                  data={plans}
                  required
                  style={{ width: '100%' }}
                  value={formData.plan}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      plan: value,
                    }))
                  }
                />
              </Form.Group>

              {/* Device Selection */}
              <Form.Group controlId="device">
                <Form.ControlLabel>
                  <strong>Device 📱</strong>
                </Form.ControlLabel>
                <Form.Control
                  name="device"
                  placeholder="Enter device info"
                  required
                  value={formData.device}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      device: value,
                    }))
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
            <Button appearance="primary" onClick={submitHandler}>
              Create Trial
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  )
}

export default TrialCustomer
