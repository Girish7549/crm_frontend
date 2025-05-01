import React, { useEffect, useState, createRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import { AppFooter, AppHeader, AppSidebar } from '../../../components'
import {
  ButtonToolbar,
  DatePicker,
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

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { baseUrl } from '../../../API/Api'
// Rsuite Components
import 'rsuite/dist/rsuite.min.css'
// import './style.css'

import Loader from '../../../components/loader/Loader'
import CallbackTimer from '../../../components/employee/CallbackTimer'
import LottiePlayer from '../../../components/employee/LottiePlayer'
import CallbackChecker from '../../../components/employee/CallbackChecker'
import NotesTimeline from '../../../components/employee/NotesTimeline'
import CallbackDrawer from '../../../components/employee/CallbackDrawer'
import CallbackDetailModal from '../../../components/employee/CallbackDetailModal'

const { Column, HeaderCell, Cell } = Table

const CompactCell = (props) => <Cell {...props} style={{ padding: 4 }} />
const CompactHeaderCell = (props) => <HeaderCell {...props} style={{ padding: 4 }} />

const defaultColumns = [
  {
    key: 'name',
    label: 'Customer Name',
    fixed: true,
    width: 250,
  },
  {
    key: 'phone',
    label: 'Contact No.',
    width: 180,
  },
  {
    key: 'email',
    label: 'Email',
    width: 300,
  },
  {
    key: 'address',
    label: 'Address',
    width: 370,
  },
  {
    key: 'scheduledTime',
    label: 'Callback Time',
    width: 200,
  },
  {
    key: 'status',
    label: 'Status',
    width: 180,
  },
  {
    key: 'notes',
    label: 'Notes',
    width: 370,
  },
  {
    key: 'action',
    label: 'Action',
    align: 'center',
    width: 185,
  },
]

const StatusCell = ({ rowData, dataKey, ...props }) => {
  const status = rowData[dataKey]?.toLowerCase() || ''

  const isPending = status === 'pending'
  const isRescheduled = status === 'rescheduled'
  const isCompleted = status === 'completed'

  const style = {
    backgroundColor: isPending
      ? '#fff3cd'
      : isCompleted
        ? '#d4edda'
        : isRescheduled
          ? '#e2e3f3'
          : '#f8d7da',
    color: isPending ? '#856404' : isCompleted ? '#155724' : isRescheduled ? '#4b0082' : '#721c24',
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

const Callback = () => {
  const [compact, setCompact] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [showHeader, setShowHeader] = React.useState(true)
  const [hover, setHover] = React.useState(true)
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key))

  const columns = defaultColumns.filter((column) => columnKeys.some((key) => key === column.key))
  //   const CustomCell = compact ? CompactCell : Cell
  //   const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell

  const userID = JSON.parse(localStorage.getItem('user'))

  const url_Create_callback = `${baseUrl}/callback`
  const get_all_services = `${baseUrl}/service`
  const get_employee_callback = `${baseUrl}/callback/employee/${userID.id}`

  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [customerDetails, setCustomerDetails] = useState(null)
  const [openWithHeader, setOpenWithHeader] = React.useState(false)
  const [service, setService] = useState(null)
  const [data, setData] = useState([])
  const [rowData, setRowData] = useState(null)
  const [page, setPage] = useState(1)
  const [totalRows, setTotalRows] = useState(0)
  const [editToggel, setEditToggel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    scheduledTime: '',
    createdBy: userID.id,
  })

  const viewDetailsCustomer = (data) => {
    setCustomerDetails(data)
    setOpenModal(true)
  }

  const handleCloseDetails = () => setOpenModal(false)

  useEffect(() => {
    getAllCallback()
  }, [])

  async function getAllCallback(page = 1) {
    try {
      const req = await fetch(`${get_employee_callback}?page=${page}`)
      const res = await req.json()
      console.log('Customer Data Based On Employee:', res)
      setData(res.data)
      setTotalRows(res.pagination.totalItems)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllCallback(page)
  }, [page])

  const handleOpen = (value) => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setEditToggel(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      scheduledTime: '',
      createdBy: userID.id,
    })
  }

  function changeHandler(value, event) {
    const name = event.target.name || 'scheduledTime'
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  async function submitHandler() {
    try {
      setLoading(true)

      const payload = {
        ...formData,
        notes: [
          {
            note: formData.notes,
          },
        ],
      }

      const req = await fetch(url_Create_callback, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
      })

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        scheduledTime: '',
      })
      toast.success('Callback Created Successfully')
      handleClose()
      getAllCallback()
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
      // const data = {
      //   name: formData.name,
      //   email: formData.email,
      //   phone: formData.phone,
      //   address: formData.address,
      //   notes: formData.notes,
      //   scheduledTime: formData.scheduledTime,
      // }
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        scheduledTime: formData.scheduledTime
      }

      const req = await fetch(`${url_Create_callback}/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'cors',
      })
      toast.success('Updated Successful')
      setEditToggel(false)
      handleClose()
      getAllCallback(page)
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        scheduledTime: '',
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
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4514/4514070.png"
                    style={{ width: '60px' }}
                  ></img>{' '}
                  Create Callback
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
                height={330}
                hover={hover}
                showHeader={showHeader}
                data={data}
                bordered={bordered}
                cellBordered={bordered}
                headerHeight={compact ? 30 : 40}
                rowHeight={compact ? 30 : 46}
              >
                {/* {columnKeys.includes('_id') && (
                  <Column key="_id" width={250} fixed>
                    <HeaderCell>Customer ID</HeaderCell>
                    <Cell dataKey="_id" style={{ padding: '4px 10px' }} />
                  </Column>
                )} */}
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
                {columnKeys.includes('phone') && (
                  <Column key="phone" width={120} fixed align="center">
                    <HeaderCell>📞 Contact No.</HeaderCell>
                    <Cell dataKey="phone" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('email') && (
                  <Column key="email" width={300} fixed>
                    <HeaderCell>📧 Email</HeaderCell>
                    <Cell dataKey="email" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('address') && (
                  <Column key="address" width={350} fixed>
                    <HeaderCell>📍 Address</HeaderCell>
                    <Cell dataKey="address" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('scheduledTime') && (
                  <Column key="scheduledTime" width={150} fixed align="center">
                    <HeaderCell>⏰ Callback Time</HeaderCell>
                    <Cell style={{ padding: '4px 10px' }}>
                      {(rowData) => {
                        const date = new Date(rowData.scheduledTime)

                        const formatted = date.toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })

                        return <span>{formatted}</span>
                      }}
                    </Cell>
                  </Column>
                )}
                {columnKeys.includes('status') && (
                  <Column key="status" width={135} fixed align="center">
                    <HeaderCell>📊 Status</HeaderCell>
                    <StatusCell dataKey="status" style={{ padding: '10px 10px' }} />
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

        <Modal backdrop="static" size="md" open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>📞 Callback Details</Modal.Title>
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
              {!editToggel && (
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
              )}
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

      <CallbackDetailModal
        customerDetails={customerDetails}
        setOpenModal={setOpenModal}
        openModal={openModal}
      />
      <CallbackDrawer rowData={rowData} openWithHeader={openWithHeader} setOpenWithHeader={setOpenWithHeader} />
      <CallbackChecker callbacks={data} />
    </>
  )
}

export default Callback
