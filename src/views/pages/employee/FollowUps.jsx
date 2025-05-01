import React, { useEffect, useState, createRef, useId } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import { AppFooter, AppHeader, AppSidebar } from '../../../components'
import { ButtonToolbar, DatePicker, Form, Pagination, Placeholder, SelectPicker } from 'rsuite'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import followUpImg from '../../../assets/images/follow-us.png'

// Rsuite Components
import { Button, Stack } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'

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
import Loader from '../../../components/loader/Loader'
import { baseUrl } from '../../../API/Api'
import CallbackDrawer from '../../../components/employee/CallbackDrawer'
import LiveTimmerCell from '../../../components/employee/LiveTimmer'
// import { mockUsers } from '../../../data/mock';

const { Column, HeaderCell, Cell } = Table
// const data = mockUsers(20);

const CompactCell = (props) => <Cell {...props} style={{ padding: 4 }} />
const CompactHeaderCell = (props) => <HeaderCell {...props} style={{ padding: 4 }} />

const defaultColumns = [
  // {
  //   key: '_id',
  //   label: 'Customer Id',
  //   fixed: true,
  //   width: 250,
  // },
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
    key: 'expiredAt',
    label: 'Expired At',
    width: 120,
  },
  {
    key: 'notes',
    label: 'Notes',
    width: 320,
  },

  {
    key: 'action',
    label: 'Action',
    align: 'center',
    width: 135,
  },
]

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

  const url_Create_followUps = `${baseUrl}/followUps`
  const get_all_services = 'http://localhost:4000/api/service'
  const get_employee_followups = `${baseUrl}/followUps/employee/${userID.id}`

  const [open, setOpen] = useState(false)
  const [service, setService] = useState(null)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [editToggel, setEditToggel] = useState(false)
  const [rowData, setRowData] = useState(null)
  const [openWithHeader, setOpenWithHeader] = React.useState(false)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    salesPerson: userID.id,
  })

  useEffect(() => {
    getAllFollowUps()
  }, [])

  async function getAllFollowUps() {
    try {
      const req = await fetch(get_employee_followups)
      const res = await req.json()
      console.log('Customer Data Based On Employee :', res)
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const [reloadFollowUps, setReloadFollowUps] = useState(false)

  useEffect(() => {
    getAllFollowUps()
    setReloadFollowUps(false)
  }, [reloadFollowUps])

  const handleOpen = (value) => {
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  function changeHandler(value, event) {
    const name = event.target.name || 'purchasedService'
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  console.log('Form Data :', formData)

  async function submitHandler() {
    try {
      setLoading(true)
      const payload = {
        ...formData,
        notes: [
          {
            note: formData.notes,
            employee: userID.id,
          },
        ],
      }
      const req = await fetch(url_Create_followUps, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
      })
      const res = await req.json()
      if (!res.success) {
        toast.error('Follow-up already created and assigned to a salesperson.')
        getAllFollowUps()
        handleClose()
        getAllCustomer()
        setLoading(false)
        return
      }
      // setFormData()
      toast.success('Customer Created Successful')
      getAllFollowUps()
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
      }
      const req = await fetch(`${url_Create_followUps}/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'cors',
      })
      toast.success('Updated Successful')
      handleClose()
      getAllFollowUps()
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
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
                <h3>
                  <img src={followUpImg} height={50} alt="follow-up-img" /> Follow-Ups List
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
                    Create Customer
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
                {columnKeys.includes('name') && (
                  <Column key="name" width={230} fixed>
                    <HeaderCell>🧑 Customer Name</HeaderCell>
                    <Cell dataKey="name" style={{ padding: '4px 10px' }} />
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
                {/* {columnKeys.includes('expiredAt') && (
                  <Column key="expiredAt" width={150} fixed align="center">
                    <HeaderCell>⏰ Expired At</HeaderCell>
                    <Cell dataKey="expiredAt" style={{ padding: '4px 10px' }} />
                  </Column>
                )} */}
                {/* {columnKeys.includes('notes') && (
                  <Column key="notes" width={120} fixed align='center'>
                    <HeaderCell>📝 Notes</HeaderCell>
                    <Cell dataKey="notes" style={{ padding: '4px 10px' }} />
                  </Column>
                )} */}
                {columnKeys.includes('expiredAt') && (
                  <Column key="expiredAt" width={180} align="center" fixed>
                    <HeaderCell>⏰ Time Left</HeaderCell>
                    <LiveTimmerCell dataKey="expiredAt" />
                  </Column>
                )}

                {columnKeys.includes('notes') && (
                  <Column key="notes" width={100} fixed align="center">
                    <HeaderCell>📝 Notes</HeaderCell>
                    <Cell style={{ padding: '4px 10px' }}>
                      {(rowData) => (
                        <Button
                          onClick={() => {
                            setRowData(rowData)
                            setOpenWithHeader(true)
                          }}
                          style={{ paddingBlock: '0px', marginTop: '0px' }}
                          appearance="ghost"
                        >
                          {' '}
                          View{' '}
                        </Button>
                      )}
                    </Cell>
                  </Column>
                )}
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
                            setOpen(true)
                            setFormData(rowData)
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
        <Modal backdrop="static" size="md" open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>📞 Follow-Ups Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form fluid layout="vertical">
              <Form.Group controlId="name">
                <Form.ControlLabel>Customer Name 🧑</Form.ControlLabel>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={changeHandler}
                  placeholder="Enter customer's name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.ControlLabel>Email Address 📧</Form.ControlLabel>
                <Form.Control
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={changeHandler}
                  placeholder="example@email.com"
                  required
                />
              </Form.Group>

              <Form.Group controlId="phone">
                <Form.ControlLabel>Phone Number 📞</Form.ControlLabel>
                <Form.Control
                  name="phone"
                  type="number"
                  value={formData.phone}
                  onChange={changeHandler}
                  placeholder="Enter phone number"
                  required
                />
              </Form.Group>

              <Form.Group controlId="address">
                <Form.ControlLabel>Customer Address 📍</Form.ControlLabel>
                <Form.Control
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={changeHandler}
                  placeholder="Street, City, Zip"
                  required
                />
              </Form.Group>

              {!editToggel && (
                <Form.Group controlId="notes">
                  <Form.ControlLabel>Additional Notes 📝</Form.ControlLabel>
                  <Form.Control
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={changeHandler}
                    placeholder="Write any important details..."
                    required
                  />
                </Form.Group>
              )}
              {/* {!editToggel && (
                <Form.Group controlId="scheduledTime">
                  <Form.ControlLabel>Schedule Follow-up ⏰</Form.ControlLabel>
                  <DatePicker
                    name="scheduledTime"
                    format="dd MMM yyyy hh:mm:ss aa"
                    placeholder="Select date and time"
                    placement="top"
                    value={formData.scheduledTime}
                    onChange={changeHandler}
                    style={{ width: '100%' }}
                    oneTap
                  />
                </Form.Group>
              )} */}
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
            {loading ? (
              <Button appearance="primary" style={{ cursor: 'wait' }}>
                <Loader />
              </Button>
            ) : editToggel ? (
              <Button onClick={updateHandler} appearance="primary">
                Update
              </Button>
            ) : (
              <Button onClick={submitHandler} appearance="primary">
                Create
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
      <CallbackDrawer
        rowData={rowData}
        calback={false}
        openWithHeader={openWithHeader}
        setOpenWithHeader={setOpenWithHeader}
        // setReloadFollowUps={setReloadFollowUps}
      />
    </>
  )
}

export default Colors
