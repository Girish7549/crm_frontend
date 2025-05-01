import React, { useEffect, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import { AppFooter, AppHeader, AppSidebar } from '../../../components'
import {
  ButtonToolbar,
  Divider,
  Form,
  Pagination,
  Panel,
  Placeholder,
  SelectPicker,
  Tag,
  Whisper,
} from 'rsuite'
import { Modal, Stack, Button } from 'rsuite'
import { Table, Toggle, TagPicker, VStack, HStack } from 'rsuite'
import {
  FaUser,
  FaAddressCard,
  FaPhone,
  FaEnvelope,
  FaUserPlus,
  FaLink,
  FaCogs,
  FaCalendarAlt,
  FaUserFriends,
} from 'react-icons/fa'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { baseUrl } from '../../../API/Api'
import customer from '../../../assets/images/customer.png'
// Rsuite Components
import 'rsuite/dist/rsuite.min.css'
import './style.css'

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

import Loader from '../../../components/loader/Loader'
import { Tooltip } from '@coreui/coreui'
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
    width: 100,
  },

  {
    key: 'action',
    label: 'Action',
    align: 'center',
    width: 135,
  },
]

const StatusCell = ({ rowData, dataKey, ...props }) => {
  const status = rowData[dataKey]?.toLowerCase()

  const colorMap = {
    unassigned: { bg: '#f0f0f0', color: '#6c757d' },
    followup: { bg: '#fff3cd', color: '#856404' },
    trial: { bg: '#cce5ff', color: '#004085' },
    sale: { bg: '#d4edda', color: '#155724' },
    active: { bg: '#d1ecf1', color: '#0c5460' },
    default: { bg: '#f8f9fa', color: '#212529' },
  }

  const { bg, color } = colorMap[status] || colorMap.default

  const style = {
    backgroundColor: bg,
    color: color,
    borderRadius: 8,
    padding: '2px 6px',
    marginTop: '-0.5rem',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: 80,
    textTransform: 'capitalize',
  }

  return (
    <Cell {...props}>
      <span style={style}>{status}</span>
    </Cell>
  )
}

const Colors = () => {
  const [compact, setCompact] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [showHeader, setShowHeader] = React.useState(true)
  const [hover, setHover] = React.useState(true)
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key))

  const columns = defaultColumns.filter((column) => columnKeys.some((key) => key === column.key))
  const CustomCell = compact ? CompactCell : Cell
  const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell

  const userID = JSON.parse(localStorage.getItem('user'))
  const status = [
    { label: 'followup', value: 'followup' },
    { label: 'trial', value: 'trial' },
    { label: 'sale', value: 'sale' },
  ]

  const url_Create_customer = `${baseUrl}/customer`
  const get_all_services = `${baseUrl}/service`
  const get_employee_customer = `${baseUrl}/customer/employee/${userID.id}`

  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [service, setService] = useState(null)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalRows, setTotalRows] = useState(0)
  const [editToggel, setEditToggel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: '',
    purchasedService: userID?.service?._id,
    createdBy: userID.id,
  })

  const viewDetailsCustomer = (data) => {
    setOpenModal(true)
    setCustomerDetails(data)
  }

  const handleCloseDetails = () => setOpenModal(false)

  useEffect(() => {
    getAllCustomer()
  }, [])

  async function getAllCustomer(page = 1) {
    try {
      const req = await fetch(`${get_employee_customer}?page=${page}`)
      const res = await req.json()
      console.log('Customer Data Based On Employee:', res)
      setData(res.data)
      setTotalRows(res.pagination.totalItems)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllCustomer(page)
  }, [page])

  const handleOpen = (value) => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      purchasedService: '',
      createdBy: userID.id,
    })
  }

  function changeHandler(value, event) {
    const name = event.target.name || 'status'
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  async function submitHandler() {
    try {
      setLoading(true)
      const req = await fetch(url_Create_customer, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        mode: 'cors',
      })
      const res = await req.json()
      // console.log("Response :", res)
      if (!res.success) {
        toast.error('Already Existed Customer')
        handleClose()
        getAllCustomer()
        setLoading(false)
        return
      }
      // setFormData()
      toast.success('Customer Created Successful')
      handleClose()
      getAllCustomer()
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }
  async function updateHandler() {
    try {
      setLoading(true)
      console.log('Cusotmer ID :', formData._id)
      console.log('Cusotmer ID :', formData)
      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        status: formData.status,
        purchasedService: formData.purchasedService._id,
      }
      const req = await fetch(`${url_Create_customer}/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'cors',
      })
      toast.success('Updated Successful')
      handleClose()
      getAllCustomer(page)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        purchasedService: '',
        createdBy: userID.id,
      })
      setLoading(false)
    } catch (err) {
      console.log(err)
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
                <h3><img src={customer} height={50} alt='customer-img' /> Create Customer</h3>

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
                    Create Customer
                  </Button>
                </div>
              </Stack>
              <hr />

              <Table
                height={330}
                hover={hover}
                showHeader={showHeader}
                data={data}
                bordered={bordered}
                cellBordered={bordered}
                headerHeight={compact ? 30 : 40}
                rowHeight={compact ? 30 : 46}
              >
                {columnKeys.includes('_id') && (
                  <Column key="_id" width={250} fixed>
                    <HeaderCell>🆔 Customer ID</HeaderCell>
                    <Cell dataKey="_id" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('name') && (
                  <Column key="name" width={250} fixed>
                    <HeaderCell>🧑 Customer Name</HeaderCell>
                    <Cell style={{ cursor: 'pointer', padding: '4px 10px' }}>
                      {(rowData) =>
                        rowData.name ? (
                          <p onClick={() => viewDetailsCustomer(rowData)}>{rowData.name}</p>
                        ) : (
                          'N/A'
                        )
                      }
                    </Cell>
                  </Column>
                )}
                {columnKeys.includes('email') && (
                  <Column key="email" width={300} fixed>
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
                  <Column key="address" width={320} fixed>
                    <HeaderCell>📍 Address</HeaderCell>
                    <Cell dataKey="address" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {/* {columnKeys.includes('status') && (
                  <Column key="status" width={120} fixed align="center">
                    <HeaderCell>📊 Status</HeaderCell>
                    <StatusCell dataKey="status" />
                  </Column>
                )} */}
                {columnKeys.includes('action') && (
                  <Column key="action" width={135} fixed align="center">
                    <HeaderCell>⚙️ Action</HeaderCell>
                    <Cell dataKey="action" style={{ padding: '4px 10px' }}>
                      {(rowData) => (
                        <Button
                          appearance="link"
                          onClick={() => {
                            console.log('Customer Data :', rowData)
                            setEditToggel(true)
                            setFormData({
                              ...rowData,
                              purchasedService: rowData.purchasedService._id,
                            })

                            setOpen(true)
                          }}
                          style={{ padding: '0px' }}
                        >
                          Edit
                        </Button>
                      )}
                    </Cell>
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
                  limit={10}
                  total={totalRows}
                  activePage={page}
                  onChangePage={setPage}
                />
              </div>
            </div>
          </div>
          <AppFooter />
        </div>
        <Modal backdrop="static" size="sm" open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>Customer Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Placeholder.Paragraph rows={size === 'full' ? 100 : 10} /> */}
            <Form layout="horizontal">
              <Form.Group controlId="name-6">
                <Form.ControlLabel>Name</Form.ControlLabel>
                <Form.Control name="name" required value={formData.name} onChange={changeHandler} />
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
                <Form.ControlLabel>Status</Form.ControlLabel>
                {/* <Form.Control
                  name="service"
                  rows={5}
                  value={userID.service.name}
                  placeholder="Select Service"
                  style={{ color: '#3399ff' }}
                  onChange={changeHandler}
                /> */}
                <SelectPicker
                  name="status"
                  style={{ width: '54%' }}
                  value={formData.status}
                  data={status}
                  searchable={false}
                  onChange={changeHandler}
                />
              </Form.Group>

              {/* <Form.Group>
                <ButtonToolbar>
                  <Button appearance="primary">Submit</Button>
                  <Button appearance="default">Cancel</Button>
                </ButtonToolbar>
              </Form.Group> */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
            {loading ? (
              <Button onClick={submitHandler} appearance="primary" style={{ cursor: 'wait' }}>
                <Loader></Loader>
              </Button>
            ) : editToggel ? (
              <Button onClick={updateHandler} appearance="primary">
                {' '}
                Update{' '}
              </Button>
            ) : (
              <Button onClick={submitHandler} appearance="primary">
                {' '}
                Create{' '}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>

      <Modal open={openModal} onClose={handleCloseDetails} size="lg">
        <Modal.Header>
          <Modal.Title className="text-lg font-semibold">🎯 Customer Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Basic Info */}
            <Panel bordered header="🧾 Basic Info" shaded className="rounded-2xl shadow-sm">
              <p>
                <FaUser className="inline mr-2" /> <b>Name:</b> {customerDetails?.name}
              </p>
              <p>
                <FaEnvelope className="inline mr-2" /> <b>Email:</b> {customerDetails?.email}
              </p>
              <p>
                <FaPhone className="inline mr-2" /> <b>Phone:</b> {customerDetails?.phone}
              </p>
              <p>
                <FaAddressCard className="inline mr-2" /> <b>Address:</b> {customerDetails?.address}
              </p>
              {/* <p>
                <b>Status:</b> <Tag color="blue">{customerDetails?.status}</Tag>
              </p> */}
              <p>
                <b>Reffer Code:</b> <Tag color="violet">{customerDetails?.refferCode}</Tag>
              </p>
            </Panel>

            {/* Service Purchased */}
            <Panel bordered header="🛒 Purchased Service" shaded className="rounded-2xl shadow-sm">
              {customerDetails?.purchasedService ? (
                <>
                  <p>
                    <FaCogs className="inline mr-2" /> <b>Service:</b>{' '}
                    {customerDetails?.purchasedService.name}
                  </p>
                  <p>
                    <b>Description:</b> {customerDetails?.purchasedService.description}
                  </p>
                </>
              ) : (
                <p>Not Purchased</p>
              )}
            </Panel>

            {/* Referred By */}
            <Panel bordered header="🔗 Referred By" shaded className="rounded-2xl shadow-sm">
              {customerDetails?.refferedBy ? (
                <>
                  <p>
                    <FaUserPlus className="inline mr-2" /> <b>Name:</b>{' '}
                    {customerDetails?.refferedBy.name}
                  </p>
                  <p>
                    <FaEnvelope className="inline mr-2" /> <b>Email:</b>{' '}
                    {customerDetails?.refferedBy.email}
                  </p>
                </>
              ) : (
                <p>Not Available</p>
              )}
            </Panel>

            {/* Created By */}
            <Panel bordered header="👤 Created By" shaded className="rounded-2xl shadow-sm">
              {customerDetails?.createdBy ? (
                <>
                  <p>
                    <FaUser className="inline mr-2" /> <b>Name:</b>{' '}
                    {customerDetails?.createdBy.name}
                  </p>
                  <p>
                    <FaEnvelope className="inline mr-2" /> <b>Email:</b>{' '}
                    {customerDetails?.createdBy.email}
                  </p>
                  <p>
                    <b>Role:</b> {customerDetails?.createdBy.role}
                  </p>
                </>
              ) : (
                <p>Not Available</p>
              )}
              <Divider />
              <p>
                <FaCalendarAlt className="inline mr-2" /> <b>Created At:</b>{' '}
                {new Date(customerDetails?.createdAt).toLocaleString()}
              </p>
            </Panel>

            {/* Referred Users */}
            <Panel
              bordered
              header={
                <div className="d-flex align-items-center gap-2">
                  <FaUserFriends className="text-primary" />
                  <span className="fw-semibold">Referred Users</span>
                  <Tag color="green" size="sm">
                    {customerDetails?.reffers?.length}
                  </Tag>
                </div>
              }
              shaded
              className="rounded-2xl shadow-sm col-span-full"
            >
              {customerDetails?.reffers?.length === 0 ? (
                <p className="text-muted">No referrals yet.</p>
              ) : (
                <div className="reffered-user-grid">
                  {customerDetails?.reffers.map((r, index) => (
                    <div key={index} className="reffer-card">
                      <FaUser className="me-2 text-dark" />
                      <span>
                        <b>{r.name}</b> <span className="text-muted">({r.email})</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleCloseDetails} appearance="primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Colors
