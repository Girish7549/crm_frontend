import React, { useEffect, useState, createRef, useRef } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import { AppFooter, AppHeader, AppSidebar } from '../../../components'
import ArowBackIcon from '@rsuite/icons/ArowBack'
import TrashIcon from '@rsuite/icons/Trash'
import CloseIcon from '@rsuite/icons/Close'
import { baseUrl } from '../../../API/Api'
import UploadsVoiceNoteModal from './UploadsVoiceModal.jsx'

import {
  ButtonToolbar,
  Card,
  Drawer,
  Form,
  IconButton,
  Input,
  InputGroup,
  InputNumber,
  Pagination,
  Panel,
  PanelGroup,
  Placeholder,
  SelectPicker,
  Text,
  Tooltip,
  Whisper,
  Tag,
  Divider,
  FlexboxGrid,
  Tabs,
} from 'rsuite'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Rsuite Components
import { Button, Stack } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'

import { Table, Toggle, TagPicker, VStack, Uploader } from 'rsuite'
import { Modal } from 'rsuite'
import SearchIcon from '@rsuite/icons/Search'
import { FaRegUserCircle } from 'react-icons/fa'
// import Loader from '../../../components/loader/Loader.js'
import UploadsVoiceModal from './UploadsVoiceModal.jsx'
import Loader from '../../../components/loader/Loader.js'
// import { mockUsers } from '../../../data/mock';
import socket from '../../../socket'

const { Column, HeaderCell, Cell } = Table
// const data = mockUsers(20);

let audio
let isPlaying = false

const CompactCell = (props) => <Cell {...props} style={{ padding: 4 }} />
const CompactHeaderCell = (props) => <HeaderCell {...props} style={{ padding: 4 }} />

const defaultColumns = [
  {
    key: 'assignedEmployee',
    label: 'Sale By',
    fixed: true,
    width: 200,
  },
  {
    key: 'customer',
    label: 'Customer Name',
    width: 600,
  },
  {
    key: 'saleItemsSummary',
    label: 'saleItemsSummary',
    width: 600,
  },
  {
    key: 'customer.email',
    label: 'Customer email',
    width: 600,
  },
  {
    key: 'customer.phone',
    label: 'customer phone',
    width: 600,
  },
  {
    key: 'totalAmount',
    label: 'Total Amount',
    width: 150,
  },
  {
    key: 'paymentMethod',
    label: 'Payment Method',
    width: 180,
  },
  {
    key: 'status',
    label: 'Status',
    width: 150,
    align: 'center',
    cellStyle: { textAlign: 'center' },
  },
  {
    key: 'activation',
    label: 'activation',
    width: 150,
  },
  {
    key: 'createdAt',
    label: 'Created At',
    width: 200,
  },
  {
    key: 'paymentProof',
    label: 'Proof',
    width: 150,
  },
  {
    key: 'voiceProof',
    label: 'Voice Note',
    width: 150,
  },
]

const VoiceNoteCell = ({ rowData, dataKey, ...props }) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const audioSrc = rowData[dataKey]

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleEnded = () => setIsPlaying(false)

  const buttonStyle = {
    backgroundColor: isPlaying ? '#dc3545' : '#28a745',
    border: 'none',
    color: '#fff',
    padding: '4px 12px',
    marginTop: '-12px',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'background-color 0.2s ease',
  }

  const iconStyle = {
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    // padding: '4px 12px',
    marginTop: '-10px',
  }

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  }

  const handleOpenNewTab = () => {
    if (audioSrc) {
      window.open(audioSrc, '_blank')
    }
  }

  return (
    <Cell {...props}>
      {audioSrc ? (
        <div style={containerStyle}>
          <button onClick={togglePlay} style={buttonStyle}>
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>

          {/* Download button opens in new tab */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/1765/1765469.png"
            alt="Download"
            style={iconStyle}
            onClick={handleOpenNewTab}
            title="Open in new tab"
          />

          <audio
            ref={audioRef}
            src={audioSrc}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
          />
        </div>
      ) : (
        <span style={{ color: '#999', fontStyle: 'italic' }}>No audio</span>
      )}
    </Cell>
  )
}

const StatusCell = ({ rowData, dataKey, ...props }) => {
  const status = rowData[dataKey]
  const isPending = status.toLowerCase() === 'pending'
  const isCompleted = status.toLowerCase() === 'completed'

  const style = {
    backgroundColor: isPending ? '#fff3cd' : isCompleted ? '#d4edda' : '#f8f9fa',
    color: isPending ? '#856404' : isCompleted ? '#155724' : '#212529',
    borderRadius: 8,
    padding: '2px 6px',
    marginTop: '-0.5rem',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: 80,
  }

  return (
    <Cell {...props}>
      <span style={style}>{status}</span>
    </Cell>
  )
}

const status = [
  { label: 'Done', value: 'done' },
  { label: 'Cancelled', value: 'cancelled' },
]

const SaleCustomers = () => {
  const [compact, setCompact] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [showHeader, setShowHeader] = React.useState(true)
  const [hover, setHover] = React.useState(true)
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key))

  const userID = JSON.parse(localStorage.getItem('user'))

  const get_all_sale = `${baseUrl}/sales/team/${userID.teamId}`
  const update_sale = `${baseUrl}/sale`

  const [open, setOpen] = useState(false)
  const [UploadsVoiceNoteModal, setUploadsVoiceNoteModal] = useState(false)
  const [openSaleDetail, setOpenSaleDetail] = useState(false)
  const [openWithHeader, setOpenWithHeader] = React.useState(false)
  const [paymentURL, setPaymentURL] = useState('')
  const [data, setData] = useState([])
  const [fileUrl, setFileUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saleData, setSaleData] = useState(null)
  const [singleSaleDetails, setSingleSaleDetails] = useState(null)
  const [editSale, setEditSale] = useState(false)
  const [page, setPage] = React.useState(1)
  const [totalRows, setTotalRows] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))

  const handleCloseVoiceModal = () => setUploadsVoiceNoteModal(false)

  const [formData, setFormData] = useState({
    status: '',
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    // Call it immediately on mount
    getAllEmpSale(page)

    // Then call it every 30 seconds
    const interval = setInterval(() => {
      getAllEmpSale(page)
    }, 30000) // 30,000 ms = 30 seconds

    // Clean up on unmount
    return () => clearInterval(interval)
  }, [page])

  function showSaleDetails(data) {
    setOpenSaleDetail(true)
    setSingleSaleDetails(data)
  }

  const formatSaleItems = (saleItems) => {
    return saleItems
      .map((item) => {
        const deviceStr = item.devices
          .map((d) => `${d.deviceType}(${d.month}m ₹${d.customPrice})`)
          .join(', ')
        const qty = item.quantity || item.qty || 1
        return `${item.plan} x${qty} - ${deviceStr}`
      })
      .join(' | ')
  }
  const calculateTotalFromSaleItems = (saleItems) => {
    return saleItems.reduce((sum, item) => {
      const itemTotal = item.devices.reduce((dSum, d) => dSum + parseFloat(d.customPrice || 0), 0)
      const qty = item.quantity || item.qty || 1
      return sum + itemTotal * qty
    }, 0)
  }
  const handleClose = () => {
    setOpen(false)
  }

  async function getAllEmpSale(page = 1) {
    try {
      const req = await fetch(`${get_all_sale}?page=${page}`)
      const res = await req.json()
      const formattedData = res.data.map((sale) => ({
        ...sale,
        customerName: sale.customer?.name || 'N/A',
        saleItemsSummary: formatSaleItems(sale.saleItems || []),
        totalAmount: sale.totalAmount || calculateTotalFromSaleItems(sale.saleItems),
        paymentMethod: sale.paymentMethod || 'N/A',
        status: sale.status || 'Pending',
        createdAt: new Date(sale.createdAt).toLocaleString(),
        paymentProof: sale.paymentProof || null,
      }))
      setTotalRows(res.pagination.totalItems)
      setSaleData(formattedData)
    } catch (err) {}
  }

  async function updateHandler() {
    try {
      setLoading(true)
      const response = await fetch(`${update_sale}/${singleSaleDetails._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: formData.status }), // send only status
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      getAllEmpSale()
      toast.success('Status Updated Successfully')
    } catch (err) {
      console.error(err)
      toast.error('Status Update failed')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const [showModal, setShowModal] = useState(false)
  const [notificationData, setNotificationData] = useState(null)

  function playSound() {
    if (!isPlaying) {
      audio = new Audio('/notification.mp3')
      audio.loop = true
      audio
        .play()
        .then(() => {
          isPlaying = true
        })
        .catch((err) => {
          console.error('Audio play failed:', err)
        })
    }
  }
  function stopSound() {
    if (audio && isPlaying) {
      audio.pause()
      audio.currentTime = 0
      isPlaying = false
    }
  }

  useEffect(() => {
    socket.on('new-sale', (data) => {
      const { assignedEmployee, saleId } = data

      if (user.role === 'support') {
        console.log('Sound Playing .........')
        getAllEmpSale(page)
        setNotificationData(data)
        setShowModal(true)
        playSound()
        toast.info('New Sale Created', `Sale ID: ${saleId}`)
      }
    })

    return () => {
      socket.off('new-sale')
    }
  }, [user])

  const handleConfirm = () => {
    stopSound()
    setShowModal(false)
  }

  return (
    <>
      <div>
        {/* <AppSidebar /> */}
        <div>
          {/* <AppHeader /> */}
          <div className="body flex-grow-1 p-2">
            <div>
              <Stack justifyContent="space-between" spacing={16}>
                <h3> Sale-Customers 📅</h3>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <TagPicker
                    data={defaultColumns}
                    labelKey="label"
                    valueKey="key"
                    value={columnKeys}
                    onChange={setColumnKeys}
                    cleanable={false}
                    style={{ width: 550 }}
                  />

                  <InputGroup inside style={{ marginBottom: '0px', width: 250 }}>
                    <Input placeholder={'Search'} />
                    <InputGroup.Button>
                      <SearchIcon />
                    </InputGroup.Button>
                  </InputGroup>
                </div>
              </Stack>
              <hr />

              <Table
                height={400}
                hover={hover}
                showHeader={showHeader}
                data={saleData || []}
                bordered={bordered}
                cellBordered={bordered}
                headerHeight={compact ? 30 : 40}
                rowHeight={compact ? 35 : 46}
              >
                {columnKeys.includes('customer') && (
                  <Column key="customerName" width={150} fixed>
                    <HeaderCell>👨‍💼 Customer Name</HeaderCell>
                    <Cell dataKey="customerName" />
                  </Column>
                )}

                {columnKeys.includes('saleItemsSummary') && (
                  <Column key="saleItemsSummary" width={400} fullText>
                    <HeaderCell>📦 Plans & Devices</HeaderCell>
                    {/* <Cell dataKey="saleItemsSummary" style={{ cursor: 'pointer' }} onClick={()=> setOpenSaleDetail(true)}/> */}
                    <Cell style={{ cursor: 'pointer' }}>
                      {(rowData) =>
                        rowData.saleItemsSummary ? (
                          <p onClick={() => showSaleDetails(rowData)}>{rowData.saleItemsSummary}</p>
                        ) : (
                          'N/A'
                        )
                      }
                    </Cell>
                  </Column>
                )}
                {columnKeys.includes('customer.email') && (
                  <Column key="customer.email" width={200}>
                    <HeaderCell>📧 Email</HeaderCell>
                    <Cell dataKey="customer.email" />
                  </Column>
                )}

                {columnKeys.includes('customer.phone') && (
                  <Column key="customer.phone" width={130}>
                    <HeaderCell>☎️ Phone</HeaderCell>
                    <Cell dataKey="customer.phone" />
                  </Column>
                )}
                {columnKeys.includes('customer') && (
                  <Column key="customerName" width={150} fixed>
                    <HeaderCell>👨‍💼 Sale By</HeaderCell>
                    <Cell dataKey="assignedEmployee.name" />
                  </Column>
                )}

                {columnKeys.includes('totalAmount') && (
                  <Column key="totalAmount" width={100} align="center">
                    <HeaderCell>💰 Total Amount</HeaderCell>
                    <Cell dataKey="totalAmount" />
                  </Column>
                )}

                {columnKeys.includes('paymentMethod') && (
                  <Column key="paymentMethod" width={150} align="center">
                    <HeaderCell>💳 Payment Method</HeaderCell>
                    <Cell dataKey="paymentMethod" />
                  </Column>
                )}

                {columnKeys.includes('paymentProof') && (
                  <Column key="paymentProof" width={120} align="center" fullText>
                    <HeaderCell>🧾 Payment Proof</HeaderCell>
                    <Cell dataKey="paymentProof" style={{ padding: '4px 10px' }}>
                      {(rowData) => {
                        const hasProof =
                          Array.isArray(rowData.paymentProof) && rowData.paymentProof.length > 0

                        return hasProof ? (
                          <Button
                            onClick={() => {
                              setOpenWithHeader(true)
                              setPaymentURL(rowData.paymentProof) // or maybe rowData.paymentProof[0]?.url
                            }}
                            style={{ paddingBlock: '0px', marginTop: '0px' }}
                            appearance="ghost"
                          >
                            View
                          </Button>
                        ) : null // show nothing if array is empty
                      }}
                    </Cell>
                  </Column>
                )}

                {columnKeys.includes('createdAt') && (
                  <Column key="createdAt" width={160} align="center">
                    <HeaderCell style={{ fontWeight: 'bold' }}>🗓️ Created At</HeaderCell>
                    <Cell dataKey="createdAt" />
                  </Column>
                )}

                {columnKeys.includes('status') && (
                  <Column key="status" width={100} align="center">
                    <HeaderCell>📌 Status</HeaderCell>
                    <Cell>
                      {(rowData) => {
                        const status = rowData.status?.toLowerCase()

                        const statusStyles = {
                          done: {
                            backgroundColor: '#d4edda',
                            color: '#155724',
                          },
                          pending: {
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                          },
                          default: {
                            backgroundColor: '#e2e3e5',
                            color: '#6c757d',
                          },
                        }

                        const { backgroundColor, color } =
                          statusStyles[status] || statusStyles.default

                        return (
                          <div
                            onClick={() => {
                              setFormData(rowData)
                              setSingleSaleDetails(rowData)
                              setEditSale(true)
                              setOpen(true)
                            }}
                            style={{
                              cursor: 'pointer',
                              backgroundColor,
                              color,
                              padding: '4px',
                              marginTop: '-0.5rem',
                              borderRadius: '15px',
                              textAlign: 'center',
                              textTransform: 'capitalize',
                              minWidth: '80px',
                            }}
                          >
                            {rowData.status}
                          </div>
                        )
                      }}
                    </Cell>
                  </Column>
                )}
                {columnKeys.includes('activation') && (
                  <Column key="activation" width={100} align="center">
                    <HeaderCell style={{ fontWeight: 'bold' }}>⚡ Activation</HeaderCell>
                    <Cell>
                      {(rowData) => {
                        const activation = rowData.activation?.toLowerCase()

                        const activationStyles = {
                          done: {
                            backgroundColor: '#d4edda',
                            color: '#155724',
                          },
                          pending: {
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                          },
                          default: {
                            backgroundColor: '#e2e3e5',
                            color: '#6c757d',
                          },
                        }

                        const { backgroundColor, color } =
                          activationStyles[activation] || activationStyles.default

                        return (
                          <div
                            style={{
                              backgroundColor,
                              color,
                              padding: '4px',
                              marginTop: '-0.5rem',
                              // borderRadius: '0.25rem',
                              textAlign: 'center',
                              borderRadius: '15px',
                              textTransform: 'capitalize',
                              minWidth: '80px',
                            }}
                          >
                            {rowData.activation}
                          </div>
                        )
                      }}
                    </Cell>
                  </Column>
                )}

                {columnKeys.includes('voiceProof') && (
                  <Column key="voiceProof" width={200} align="center">
                    <HeaderCell>🎤 Voice Note</HeaderCell>
                    <VoiceNoteCell dataKey="voiceProof" />
                  </Column>
                )}
                <Column width={110} style={{ padding: '11px 10px' }} align="center">
                  <HeaderCell>🕹️ Action</HeaderCell>

                  <Cell>
                    {(rowData) => (
                      <Button
                        appearance="link"
                        onClick={() => {
                          setFormData(rowData)
                          setSingleSaleDetails(rowData)
                          setUploadsVoiceNoteModal(true)
                        }}
                        style={{ padding: '0px' }}
                      >
                        Upload audio
                      </Button>
                    )}
                  </Cell>
                </Column>
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
          {/* <AppFooter /> */}
        </div>

        {/* Create && Update Sale  */}
        <Modal backdrop="static" size="sm" open={open}>
          <Modal.Header>
            <Modal.Title>Sale Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form layout="horizontal">
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                {/* Payment Method */}
                <Form.Group style={{ display: 'flex', width: '40%' }}>
                  <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                    Status
                  </Form.ControlLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <SelectPicker
                      data={status}
                      style={{ width: '100%' }}
                      value={formData.status}
                      searchable={false}
                      onChange={(value) => handleInputChange('status', value)}
                    />
                  </div>
                </Form.Group>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ marginTop: '1rem' }}>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
            {loading ? (
              <Button appearance="primary" style={{ cursor: 'wait' }}>
                <Loader></Loader>
              </Button>
            ) : editSale ? (
              <Button onClick={updateHandler} appearance="primary">
                {' '}
                Update{' '}
              </Button>
            ) : (
              <Button appearance="primary"> Create </Button>
            )}
          </Modal.Footer>
        </Modal>

        {/* Sale Details  */}
        <Modal size={'full'} open={openSaleDetail} onClose={() => setOpenSaleDetail(false)}>
          <Modal.Header>
            <Button
              onClick={() => setOpenSaleDetail(false)}
              style={{
                backgroundColor: '#E3F2FD',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#2F80ED',
                marginBottom: '0.5rem',
              }}
            >
              <ArowBackIcon style={{ marginRight: '4px' }}></ArowBackIcon>
              Back
            </Button>
            <Modal.Title>
              <FlexboxGrid justify="center" align="center" style={{ flexWrap: 'wrap' }}>
                <FlexboxGrid.Item
                  colspan={6}
                  style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Tag color="blue">Customer Name:</Tag>
                  {/* <br /> */}
                  <span style={{ fontWeight: 'bold' }}>{singleSaleDetails?.customer.name}</span>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item
                  colspan={6}
                  style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Tag color="cyan">Email:</Tag>
                  {/* <br /> */}
                  <span style={{ fontWeight: 'bold' }}>{singleSaleDetails?.customer.email}</span>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item
                  colspan={6}
                  style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Tag color="green">Phone No:</Tag>
                  {/* <br /> */}
                  <span style={{ fontWeight: 'bold' }}>{singleSaleDetails?.customer.phone}</span>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item
                  colspan={6}
                  style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Tag color="orange">Address:</Tag>
                  {/* <br /> */}
                  <span style={{ fontWeight: 'bold' }}>{singleSaleDetails?.customer.address}</span>
                </FlexboxGrid.Item>
              </FlexboxGrid>
              <FlexboxGrid style={{ flexWrap: 'wrap' }} className="mt-4">
                <FlexboxGrid.Item
                  colspan={6}
                  style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Tag color="blue">Sale By:</Tag>
                  {/* <br /> */}
                  <span style={{ fontWeight: 'bold' }}>
                    {singleSaleDetails?.assignedEmployee.name}
                  </span>
                </FlexboxGrid.Item>

                <FlexboxGrid.Item
                  colspan={6}
                  style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <Tag color="cyan">Role:</Tag>
                  {/* <br /> */}
                  <span style={{ fontWeight: 'bold' }}>
                    {singleSaleDetails?.assignedEmployee.role}
                  </span>
                </FlexboxGrid.Item>
              </FlexboxGrid>

              <Divider style={{ marginTop: 10, marginBottom: 0 }} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3 style={{ color: '#226744' }}>Total Amount :${singleSaleDetails?.totalAmount}</h3>
            <PanelGroup>
              {singleSaleDetails?.saleItems.map((plan) => (
                <Panel header={`${plan.plan}`} key={plan._id}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {plan?.devices.map((device) => (
                      <Card width={320} key={device._id}>
                        <Card.Header as="h5" style={{ color: '#226744' }}>
                          Total : ${device.customPrice}
                        </Card.Header>
                        <Card.Body>
                          <p>Device : {device.deviceType}</p>
                          <p>Duration : {device.month} Month</p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Panel>
              ))}
            </PanelGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setOpenSaleDetail(false)} appearance="primary">
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Drawer
          open={openWithHeader}
          onClose={() => setOpenWithHeader(false)}
          flexDirection="column"
        >
          <Drawer.Header>
            <Drawer.Title>Payment Proof</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {paymentURL.length > 0 ? (
                paymentURL.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`payment-proof-${index}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      border: '1px solid #eee',
                      borderRadius: '6px',
                    }}
                  />
                ))
              ) : (
                <div>No payment proof uploaded.</div>
              )}
            </div>
          </Drawer.Body>
        </Drawer>
        <UploadsVoiceModal
          open={UploadsVoiceNoteModal}
          getAllEmpSale={getAllEmpSale}
          data={singleSaleDetails}
          handleClose={handleCloseVoiceModal}
        />
      </div>

      <Modal open={showModal} onClose={handleConfirm}>
        <Modal.Header>
          <Modal.Title>New Sale Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Sale ID:</b> {notificationData?.saleId}
          </p>
          <p>Please confirm once you have seen this notification.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirm} appearance="primary">
            I Have Read
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SaleCustomers
