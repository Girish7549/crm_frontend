import React, { useEffect, useState, createRef, useRef } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import ArowBackIcon from '@rsuite/icons/ArowBack'
import TrashIcon from '@rsuite/icons/Trash'
import CloseIcon from '@rsuite/icons/Close'
import { baseUrl } from '../../../API/Api'
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdDevices,
  MdSecurity,
  MdDateRange,
  MdOutlineLink,
  MdOutlineAppSettingsAlt,
  MdAccountBox,
  MdWifi,
  MdCheckCircle,
  MdAccessTime,
} from 'react-icons/md'

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
// import Loader from '../../../components/loader/Loader.jsx'
import DrawerNotesActivation from './DrawerNotesActivation.jsx'
import CreateTrialActivationsModal from './CreateTrialActivationModal.jsx'
import Loader from '../../../components/loader/Loader.js'
// import { mockUsers } from '../../../data/mock';

const { Column, HeaderCell, Cell } = Table

const CompactCell = (props) => <Cell {...props} style={{ padding: 4 }} />
const CompactHeaderCell = (props) => <HeaderCell {...props} style={{ padding: 4 }} />

const defaultColumns = [
  {
    key: 'customer.name',
    label: 'customer.name',
    fixed: true,
    width: 200,
  },
  {
    key: 'saleItemsSummary',
    label: 'saleItemsSummary',
    width: 600,
  },
  {
    key: 'customer.email',
    label: 'customer.email',
    width: 600,
  },
  {
    key: 'customer.phone',
    label: 'customer.phone',
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
    key: 'notes',
    label: 'Notes',
    width: 370,
  },
]

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

const status = [{ label: 'Active', value: 'active' }]

const TrialActivations = () => {
  const [page, setPage] = useState(1)
  const [compact, setCompact] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [showHeader, setShowHeader] = React.useState(true)
  const [hover, setHover] = React.useState(true)
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key))
  const [filterCustomers, setFilterCustomers] = useState([])
  const userID = JSON.parse(localStorage.getItem('user'))

  const get_all__emp_trial_activations = `${baseUrl}/trialActivations/support/${userID?.id}`
  const update_activation = `${baseUrl}/trialActivations`
  const get_all_emp_trial = `${baseUrl}/trial/team/${userID.teamId}?page=1`

  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [openWithHeader, setOpenWithHeader] = React.useState(false)
  const [data, setData] = useState([])
  const [openDetails, setOpenDetails] = useState(false)
  const [singleData, setSingleData] = useState()
  const [fileUrl, setFileUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activationData, setActivationData] = useState(null)
  const [singleRowData, setSingleRowData] = useState(null)
  const [editSale, setEditSale] = useState(false)
  const [totalRows, setTotalRows] = useState(false)

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const [formData, setFormData] = useState({
    status: '',
  })

  useEffect(() => {
    // Call it immediately on mount
    getAllTrialCustomer()
    // Then call it every 30 seconds
    const interval = setInterval(() => {
      getAllTrialCustomer()
      getAllEmpTrialActivations()
    }, 30000) // 30,000 ms = 30 seconds

    // Clean up on unmount
    return () => clearInterval(interval)
  }, [])

  const InfoRow = ({ icon, label, value, color = '#555' }) => (
    <FlexboxGrid.Item colspan={12} style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}
        <b>{label}:</b>
        <span style={{ color }}>{value || '---'}</span>
      </div>
    </FlexboxGrid.Item>
  )

  const monthOptions = Array.from({ length: 13 }, (_, i) => ({
    label: `${i + 1} Month${i > 0 ? 's' : ''}`,
    value: i + 1,
  }))

  useEffect(() => {
    const filtered = data?.filter((cust) => cust.status === 'pending')
    setFilterCustomers(filtered)
  }, [data])

  async function getAllTrialCustomer() {
    try {
      const req = await fetch(get_all_emp_trial)
      const res = await req.json()
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    getAllEmpTrialActivations(page)
  }, [page])

  const handleClose = () => {
    setOpen(false)
  }

  async function getAllEmpTrialActivations(page = 1) {
    try {
      const req = await fetch(`${get_all__emp_trial_activations}?page=${page}`)
      const res = await req.json()
      setActivationData(res.data)
      setTotalRows(res.pagination.totalItems)
    } catch (err) {}
  }

  async function updateHandler() {
    try {
      setLoading(true)
      const response = await fetch(`${update_activation}/${singleRowData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: formData.status }), // send only status
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      getAllEmpTrialActivations()
      toast.success('Status Updated Successfully')
    } catch (err) {
      console.error(err)
      toast.error('Status Update failed')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <div>
        <div className="body flex-grow-1 p-2">
          <div>
            <Stack justifyContent="space-between" spacing={16}>
              <h3>Trial Activation 📅</h3>

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
              <Button appearance="primary" onClick={handleOpenModal}>
                Create
              </Button>
            </Stack>
            <hr />

            <Table
              height={400}
              hover={hover}
              showHeader={showHeader}
              data={activationData || []}
              bordered={bordered}
              cellBordered={bordered}
              headerHeight={compact ? 30 : 40}
              rowHeight={compact ? 35 : 46}
            >
              {columnKeys.includes('customer.name') && (
                <Column key="customerName" width={150} fixed>
                  <HeaderCell>👨‍💼 Customer</HeaderCell>
                  <Cell dataKey="trial.name" />
                </Column>
              )}
              {columnKeys.includes('customer.email') && (
                <Column key="customerEmail" width={200}>
                  <HeaderCell>📧 Email</HeaderCell>
                  <Cell dataKey="trial.email" />
                </Column>
              )}

              {columnKeys.includes('customer.phone') && (
                <Column key="customerPhone" width={150}>
                  <HeaderCell>☎️ Phone</HeaderCell>
                  <Cell dataKey="trial.phone" />
                </Column>
              )}
              {columnKeys.includes('customer.address') && (
                <Column key="address" width={150}>
                  <HeaderCell>📍 Address</HeaderCell>
                  <Cell dataKey="trial.address" />
                </Column>
              )}

              {columnKeys.includes('saleItemsSummary') && (
                <Column key="saleItemsSummary" width={200} fixed fullText>
                  <HeaderCell>📦 Plans & Devices</HeaderCell>
                  <Cell style={{ cursor: 'pointer' }}>
                    {(rowData) => {
                      const hasTrial = rowData.trial?.plan && rowData.trial?.device
                      const hasDeviceInfo = rowData.deviceInfo

                      return hasTrial ? (
                        <div
                          onClick={() => {
                            setSingleData(rowData)
                            setOpenDetails(true)
                          }}
                        >
                          <strong>{rowData.trial.device}</strong> | {rowData.trial.plan} plan
                        </div>
                      ) : hasDeviceInfo ? (
                        <div
                          onClick={() => {
                            setSingleData(rowData)
                            setOpenDetails(true)
                          }}
                        >
                          <strong>{rowData.deviceInfo.deviceType}</strong> | ₹
                          {rowData.deviceInfo.customPrice} | {rowData.deviceInfo.plan} |{' '}
                          {rowData.deviceInfo.totalMonths} months
                        </div>
                      ) : (
                        'N/A'
                      )
                    }}
                  </Cell>
                </Column>
              )}

              <Column width={150} align="center" fullText>
                <HeaderCell>💻 Application</HeaderCell>
                <Cell dataKey="applicationName" />
              </Column>

              <Column width={200} align="center">
                <HeaderCell>🗓️ Created At</HeaderCell>
                <Cell>
                  {(rowData) =>
                    rowData.createdAt ? new Date(rowData.createdAt).toLocaleString() : '—'
                  }
                </Cell>
              </Column>

              <Column width={200} align="center">
                <HeaderCell>🗓️ Updated At</HeaderCell>
                <Cell>
                  {(rowData) =>
                    rowData.updatedAt ? new Date(rowData.updatedAt).toLocaleString() : '—'
                  }
                </Cell>
              </Column>

              <Column width={150} align="center">
                <HeaderCell>📌 Status</HeaderCell>
                <Cell>
                  {(rowData) => {
                    const status = rowData.status?.toLowerCase()
                    const statusStyles = {
                      active: { backgroundColor: '#d4edda', color: '#155724' }, // green
                      pending: { backgroundColor: '#fff3cd', color: '#856404' }, // yellow
                      granted: { backgroundColor: '#cce5ff', color: '#004085' }, // blue
                      'expired-soon': { backgroundColor: '#fdecea', color: '#b02a37' }, // soft red (⚠️ expired-soon)
                      default: { backgroundColor: '#e2e3e5', color: '#6c757d' }, // gray
                    }

                    const { backgroundColor, color } = statusStyles[status] || statusStyles.default

                    return (
                      <div
                        onClick={() => {
                          setFormData(rowData)
                          setFileUrl(rowData.paymentProof)
                          setSingleRowData(rowData)
                          setEditSale(true)
                          setOpen(true)
                        }}
                        style={{
                          cursor: 'pointer',
                          backgroundColor,
                          color,
                          marginTop: '-10px',
                          borderRadius: '15px',
                          padding: '5px 10px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {rowData.status || '—'}
                      </div>
                    )
                  }}
                </Cell>
              </Column>

              {columnKeys.includes('notes') && (
                <Column key="notes" width={100} align="center">
                  <HeaderCell>📝 Notes</HeaderCell>
                  <Cell style={{ padding: '4px 10px' }}>
                    {(rowData) => (
                      <Button
                        onClick={() => {
                          setSingleRowData(rowData)
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
      </div>

      {/* Create && Update Sale  */}
      <Modal backdrop="static" size="sm" open={open}>
        <Modal.Header>
          <Modal.Title>Activation Status</Modal.Title>
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

      {/* show Detils Activations Modal */}
      <Modal size="lg" open={openDetails} onClose={() => setOpenDetails(false)}>
        <Modal.Header>
          <Modal.Title>
            📋 <b style={{ fontSize: 18 }}>Trial Activation Details</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Customer Info */}
          <Panel bordered shaded header="🧑 Customer Information" style={{ marginBottom: 10 }}>
            <FlexboxGrid>
              <InfoRow
                icon={<MdPerson color="#3498db" />}
                label="Name"
                value={singleData?.trial.customer?.name}
              />
              <InfoRow
                icon={<MdEmail color="#9b59b6" />}
                label="Email"
                value={singleData?.trial.customer?.email}
              />
              <InfoRow
                icon={<MdPhone color="#e67e22" />}
                label="Phone"
                value={singleData?.trial.customer?.phone}
              />
              <InfoRow
                icon={<MdLocationOn color="#2ecc71" />}
                label="Address"
                value={singleData?.trial.customer?.address}
              />
            </FlexboxGrid>
          </Panel>

          {/* Device & Plan Info */}
          <Panel bordered shaded header="💻 Device & Plan Info" style={{ marginBottom: 10 }}>
            <FlexboxGrid>
              <InfoRow
                icon={<MdDevices color="#16a085" />}
                label="Device Type"
                value={singleData?.trial?.device}
              />
              <InfoRow
                icon={<MdSecurity color="#d35400" />}
                label="Plan"
                value={singleData?.trial?.plan}
              />
              {/* <InfoRow
                                icon={<MdDateRange color="#2980b9" />}
                                label="Total Months"
                                value={`${singleData?.deviceInfo?.totalMonths} Months`}
                            /> */}
              {/* <InfoRow
                                icon={<MdSecurity color="#8e44ad" />}
                                label="Price"
                                value={`₹${singleData?.deviceInfo?.customPrice}`}
                            /> */}
            </FlexboxGrid>
          </Panel>

          {/* Activation Info */}
          <Panel bordered shaded header="🔧 Activation Info" style={{ marginBottom: 10 }}>
            <FlexboxGrid>
              <InfoRow
                icon={<MdCheckCircle color="#27ae60" />}
                label="Status"
                value={
                  <Tag color={singleData?.status === 'active' ? 'green' : 'orange'}>
                    {singleData?.status}
                  </Tag>
                }
              />
              <InfoRow
                icon={<MdOutlineAppSettingsAlt color="#1abc9c" />}
                label="Application"
                value={singleData?.applicationName}
              />
              <InfoRow
                icon={<MdDateRange color="#34495e" />}
                label="Activated On"
                value={new Date(singleData?.lastActivatedAt).toLocaleString()}
              />
              <InfoRow
                icon={<MdAccessTime color="#e67e22" />}
                label="Expires On"
                value={new Date(singleData?.expirationDate).toLocaleString()}
              />
              <InfoRow
                icon={<MdWifi color="#f39c12" />}
                label="MAC Address"
                value={singleData?.macAddress}
              />
              <InfoRow
                icon={<MdOutlineLink color="#9b59b6" />}
                label="URL"
                value={singleData?.url}
              />
              <InfoRow
                icon={<MdAccountBox color="#2980b9" />}
                label="Username"
                value={singleData?.username}
              />
              <InfoRow
                icon={<MdSecurity color="#c0392b" />}
                label="Password"
                value={singleData?.password}
              />
            </FlexboxGrid>
          </Panel>

          {/* Employee Info */}
          <Panel bordered shaded header="👤 Assigned Employee" style={{ marginBottom: 10 }}>
            <FlexboxGrid>
              <InfoRow
                icon={<MdPerson color="#3498db" />}
                label="Name"
                value={singleData?.assignedEmployee?.name}
              />
              <InfoRow
                icon={<MdEmail color="#9b59b6" />}
                label="Email"
                value={singleData?.assignedEmployee?.email}
              />
            </FlexboxGrid>
          </Panel>

          {/* Duration Picker */}
          {/* <Panel bordered shaded header="📅 Set New Duration (Months)">
                        <SelectPicker
                            data={monthOptions}
                            searchable={false}
                            style={{ width: '100%' }}
                            placeholder="Select duration"
                            defaultValue={singleData?.currentMonth}
                            placement="top"
                        />
                    </Panel> */}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setOpenDetails(false)} appearance="primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <CreateTrialActivationsModal
        open={modalOpen}
        data={filterCustomers}
        getAllEmpActivations={getAllEmpTrialActivations}
        handleClose={handleCloseModal}
      />

      <DrawerNotesActivation
        rowData={singleRowData}
        calback={false}
        openWithHeader={openWithHeader}
        setOpenWithHeader={setOpenWithHeader}
        getAllEmpActivations={getAllEmpTrialActivations}
        path={'trialActivations'}
        // setReloadFollowUps={setReloadFollowUps}
      />
    </>
  )
}

export default TrialActivations
