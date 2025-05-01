import React, { useEffect, useState } from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../../../components/index'

import 'react-toastify/dist/ReactToastify.css'
import saleImage from '../../../assets/images/sales.png'
import GenerateButton from '../../../components/activation/GenerateButton'
import MagicIcon from '@rsuite/icons/legacy/Magic'

import {
  Modal,
  Button,
  Input,
  InputGroup,
  Pagination,
  Stack,
  Table,
  TagPicker,
  Form,
  ButtonToolbar,
  SelectPicker,
  Tag,
  Message,
} from 'rsuite'
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
import { Divider, FlexboxGrid, Panel } from 'rsuite'

import SearchIcon from '@rsuite/icons/Search'
import { baseUrl } from '../../../API/Api'
import Loader from '../../../components/loader/Loader'
import LiveTimmerCell from '../../../components/employee/LiveTimmer'
import SaleDetailsModal from '../../../components/activation/SaleDetailsModal'
import CallbackDrawer from '../../../components/employee/CallbackDrawer'
import ActivationDrawer from '../../../components/activation/ActivationDrawer'

import socket from '../../../socket'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { Column, HeaderCell, Cell } = Table

let audio
let isPlaying = false
// const data = mockUsers(20);

const CompactCell = (props) => <Cell {...props} style={{ padding: 4 }} />
const CompactHeaderCell = (props) => <HeaderCell {...props} style={{ padding: 4 }} />

const defaultColumns = [
  {
    key: 'name',
    label: 'Customer Name',
    fixed: true,
    width: 200,
  },
  {
    key: 'saleItemsSummary',
    label: 'Plans & Devices',
    width: 300,
  },
  {
    key: 'applicationName',
    label: 'App Name',
    width: 150,
  },
  {
    key: 'macAddress',
    label: 'Mac Address',
    width: 150,
  },
  {
    key: 'url',
    label: 'URL',
    width: 150,
  },
  {
    key: 'username',
    label: 'Username',
    width: 150,
  },
  {
    key: 'password',
    label: 'Password',
    width: 250,
  },
  {
    key: 'expirationDate',
    label: 'Expiration Date',
    width: 250,
  },
  // {
  //   key: 'month',
  //   label: 'Add Month',
  //   width: 180,
  // },
  {
    key: 'status',
    label: 'Status',
    width: 150,
    align: 'center',
    cellStyle: { textAlign: 'center' },
  },
  // {
  //   key: 'monthLeft',
  //   label: 'Month Left',
  //   width: 200,
  // },
  {
    key: 'notes',
    label: 'Notes',
    width: 100,
  },
  // {
  //   key: 'invoiceNumber',
  //   label: 'Invoice',
  //   width: 150,
  // },
]

const StatusCell = ({ rowData, dataKey, ...props }) => {
  const status = rowData[dataKey]?.toLowerCase()

  const isPending = status === 'pending'
  const isCompleted = status === 'granted'
  const isActive = status === 'active'
  const isExpiredSoon = status === 'expired-soon'

  const style = {
    backgroundColor: isPending
      ? '#fff3cd'
      : isCompleted
        ? '#d4edda'
        : isActive
          ? '#cce5ff'
          : isExpiredSoon
            ? '#ffa9a9'
            : '#f8f9fa',

    color: isPending
      ? '#856404'
      : isCompleted
        ? '#155724'
        : isActive
          ? '#004085'
          : isExpiredSoon
            ? '#ff0c0c'
            : '#212529',

    borderRadius: 8,
    padding: '2px 6px',
    marginTop: '-0.5rem',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: 80,
    fontWeight: 500,
  }

  return (
    <Cell {...props}>
      <span style={style}>{status}</span>
    </Cell>
  )
}
const TrialActivation = () => {
  const [compact, setCompact] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [showHeader, setShowHeader] = React.useState(true)
  const [hover, setHover] = React.useState(true)
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key))
  console.log('Columnn Key :', columnKeys)
  const [open, setOpen] = React.useState(false)
  const [openDetails, setOpenDetails] = React.useState(false)
  const [openAddMonth, setOpenAddMonth] = React.useState(false)
  const [singleData, setSingleData] = React.useState(null)
  const [addMonthValue, setAddMonthValue] = React.useState(1)
  const [teams, setTeams] = React.useState(null)
  const [selectedTeam, setSelectedTeam] = React.useState(null)
  const [openWithHeader, setOpenWithHeader] = React.useState(false)

  const handleOpen = (value) => {
    setOpen(true)
  }
  const status = [
    { label: 'Granted', value: 'granted' },
    { label: 'Pending', value: 'pending' },
  ]

  const [saleData, setSaleData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    macAddress: '',
    url: '',
    username: '',
    password: '',
    status: '',
  })

  const formatSaleItems = (d) => {
    return `${d.device} - ${d.plan} 1 Hrs`
  }

  function changeHandler(value, label) {
    setFormData((prev) => ({
      ...prev,
      [label]: value,
    }))
    // console.log(formData)
  }
  const user = JSON.parse(localStorage.getItem('user'))


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
    socket.on('new-activation', (data) => {
      const { activationId } = data

      if (user.role === 'activation') {
        console.log('Sound Playing .........')
        setNotificationData(data)
        setShowModal(true)
        playSound()
        toast.info('New Activation Created', `Activation ID: ${activationId}`)
      }
    })

    return () => {
      socket.off('new-activation')
    }
  }, [user])

  const handleConfirm = () => {
    stopSound()
    setShowModal(false)
  }

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

  async function submitHandler() {
    try {
      setLoading(true)
      // const req = await fetch(`${baseUrl}/activations/${id}`)
      const payload = {
        macAddress: formData.macAddress,
        url: formData.url,
        username: formData.username,
        password: formData.password,
        status: formData.status,
      }
      const req = await fetch(`${baseUrl}/trialActivations/${formData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('Form Data :', payload)
      setLoading(false)
      setOpen(false)
      getAllActivation()
    } catch (err) {
      console.log('Error!', err)
      setLoading(false)
      setOpen(false)
    }
  }

  async function getAllActivation() {
    try {
      const req = await fetch(`${baseUrl}/trialActivations`)
      const res = await req.json()
      console.log('Response :', res.data)
      const formattedData = res.data.map((sale) => ({
        ...sale,
        customerName: sale.trial.customer?.name || 'N/A',
        saleItemsSummary: formatSaleItems(sale.trial || []),
        status: sale.status || 'Pending',
        createdAt: new Date(sale.createdAt).toLocaleString(),
      }))
      console.log('Formatted data : ', formattedData)
      setSaleData(formattedData)
    } catch (err) {
      console.log('Error!', err)
    }
  }
  async function getAllTeams() {
    try {
      const req = await fetch(`${baseUrl}/teams`)
      const res = await req.json()
      const teams = res.data.map((team) => ({
        label: team.name,
        value: team._id,
      }))
      setTeams(teams)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllActivation()
    getAllTeams()
  }, [])

  async function teamSale() {
    try {
      const req = await fetch(`${baseUrl}/trialActivations/team/${selectedTeam}`)
      const res = await req.json()
      console.log('Response :', res.data)
      const formattedData = res.data.map((sale) => ({
        ...sale,
        customerName: sale.trial.customer?.name || 'N/A',
        saleItemsSummary: formatSaleItems(sale.trial || []),
        status: sale.status || 'Pending',
        createdAt: new Date(sale.createdAt).toLocaleString(),
      }))
      console.log('Formatted data : ', formattedData)
      setSaleData(formattedData)
    } catch (err) {
      console.log(err)
    }
  }

  async function addMonthHandler() {
    try {
      const payload = {
        addMonth: addMonthValue,
      }
      const req = await fetch(`${baseUrl}/activations/addMonth/${singleData?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setOpenAddMonth(false)
    } catch (err) {
      console.log('Error!', err)
    }
  }
  console.log('add month:', addMonthValue)
  console.log('Singel Data ------:', singleData)

  useEffect(() => {
    if (selectedTeam === null) {
      getAllActivation()
    } else {
      teamSale()
    }
  }, [selectedTeam])

  // setTimeout(() => {
  //   if(selectedTeam !==  null){
  //     getAllActivation()
  //   }
  // }, 60000)

  const userInfo = JSON.parse(localStorage.getItem('user'))
  console.log('User Data :', userInfo)

  const generateUniqueMacAddress = async () => {
    const generateMacAddress = () => {
      const fixedPrefix = ['00', '1A', '79']
      const randomPart = Array(3)
        .fill()
        .map(() =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, '0')
            .toUpperCase(),
        )
      return [...fixedPrefix, ...randomPart].join(':')
    }

    let uniqueMac
    let isUnique = false

    while (!isUnique) {
      const newMac = generateMacAddress()
      const res = await fetch(`${baseUrl}/check-mac?macAddress=${newMac}`)
      const data = await res.json()
      if (!data.exists) {
        uniqueMac = newMac
        isUnique = true
      }
    }

    return uniqueMac
  }

  function generateUsername(name, phone) {
    if (!name || !phone) return ''

    console.log('phone :', phone)
    console.log('name :', name)
    const cleanedName = name.toLowerCase().replace(/\s+/g, '')
    const phoneDigits = String(phone).replace(/\D/g, '')

    const randomSuffix = Math.floor(100 + Math.random() * 900) // Random 3-digit number

    const username = `${cleanedName}${phoneDigits.slice(-4)}${randomSuffix}`
    return username
  }

  function generatePassword(name, phone) {
    if (!name || !phone) return ''

    const cleanedName = name.replace(/\s+/g, '')
    const capitalName =
      cleanedName.slice(0, 1).toUpperCase() + cleanedName.slice(1, 4).toLowerCase()
    const reversedPhone = String(phone).replace(/\D/g, '').split('').reverse().join('').slice(0, 4)
    // const randomSymbols = ['@', '#', '$', '%', '&', '*', '!'];
    // const randomSymbol = randomSymbols[Math.floor(Math.random() * randomSymbols.length)];
    const randomNum = Math.floor(100 + Math.random() * 900) // 3-digit number

    return `${capitalName}${reversedPhone}${randomNum}`
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 p-2">
          <div className="body flex-grow-1 p-2">
            {/* <AppContent /> */}
            {/* <h1>Create Customer </h1> */}
            <div>
              <Stack justifyContent="space-between" spacing={16}>
                <h3>
                  {' '}
                  <img src={saleImage} height={50} alt="sale-image" /> Trial Activation
                </h3>

                <div>
                  <small>
                    <b>Select Team</b>
                  </small>
                  <SelectPicker
                    name="team"
                    style={{ width: '150%' }}
                    value={selectedTeam}
                    data={teams || []}
                    searchable={false}
                    placeholder="Select Team"
                    onChange={(value) => setSelectedTeam(value)}
                  />
                </div>
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

                  {/* <Button appearance="primary" onClick={handleOpen}>
                      Create
                    </Button> */}
                </div>
              </Stack>
              <hr />

              <Table
                height={400}
                hover={hover}
                showHeader={showHeader}
                data={saleData ? saleData : []}
                bordered={bordered}
                cellBordered={bordered}
                headerHeight={compact ? 30 : 40}
                rowHeight={compact ? 35 : 46}
              >
                {columnKeys.includes('name') && (
                  <Column key="name" width={200} fixed>
                    <HeaderCell>🧑 Customer Name</HeaderCell>
                    <Cell dataKey="trial.name" />
                  </Column>
                )}

                {columnKeys.includes('saleItemsSummary') && (
                  <Column key="saleItemsSummary" width={250} fullText>
                    <HeaderCell>📱 Devices & 📦 Plans</HeaderCell>
                    {/* <Cell dataKey="saleItemsSummary" style={{ cursor: 'pointer' }} onClick={()=> setOpenSaleDetail(true)}/> */}
                    <Cell style={{ cursor: 'pointer' }}>
                      {(rowData) =>
                        rowData.saleItemsSummary ? (
                          <p
                            onClick={() => {
                              console.log('Row Data :', rowData)
                              setSingleData(rowData)
                              setOpenDetails(true)
                            }}
                          >
                            {rowData.saleItemsSummary}
                          </p>
                        ) : (
                          'N/A'
                        )
                      }
                    </Cell>
                  </Column>
                )}

                {columnKeys.includes('applicationName') && (
                  <Column key="applicationName" width={100} align="center" fullText>
                    <HeaderCell>🧩 App Name</HeaderCell>
                    <Cell dataKey="applicationName" />
                  </Column>
                )}
                {columnKeys.includes('macAddress') && (
                  <Column key="macAddress" width={180} align="center" fullText>
                    <HeaderCell>📶 Mac Address</HeaderCell>
                    <Cell dataKey="macAddress" />
                  </Column>
                )}

                {columnKeys.includes('url') && (
                  <Column key="url" width={180} align="" fullText>
                    <HeaderCell>🌐 URL</HeaderCell>
                    <Cell dataKey="url" />
                  </Column>
                )}
                {columnKeys.includes('username') && (
                  <Column key="username" width={150} align="center" fullText>
                    <HeaderCell>📛 Username</HeaderCell>
                    <Cell dataKey="username" />
                  </Column>
                )}
                {columnKeys.includes('password') && (
                  <Column key="password" width={150} align="center" fullText>
                    <HeaderCell>🔒 Password</HeaderCell>
                    <Cell dataKey="password" />
                  </Column>
                )}

                {columnKeys.includes('status') && (
                  <Column key="status" width={150} align="center">
                    <HeaderCell>📊 Status</HeaderCell>
                    <StatusCell dataKey="status" />
                  </Column>
                )}

                {columnKeys.includes('expirationDate') && (
                  <Column key="expirationDate" width={180} align="center" fixed>
                    <HeaderCell>⏰ Time Left</HeaderCell>
                    <LiveTimmerCell dataKey="expirationDate" />
                  </Column>
                )}

                {columnKeys.includes('expirationDate') && (
                  <Column key="expirationDate" width={200} align="center">
                    <HeaderCell>🕒 Expired At</HeaderCell>
                    <Cell>
                      {(rowData) => {
                        const date = new Date(rowData.expirationDate)
                        const options = {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }
                        return rowData.expirationDate !== null
                          ? date.toLocaleString('en-US', options).replace(',', '')
                          : '---'
                      }}
                    </Cell>
                  </Column>
                )}

                {columnKeys.includes('notes') && (
                  <Column key="notes" width={100} fixed align="center">
                    <HeaderCell>📝 Notes</HeaderCell>
                    <Cell style={{ padding: '4px 10px' }}>
                      {(rowData) => (
                        <Button
                          onClick={() => {
                            setSingleData(rowData)
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

                <Column width={80} style={{ padding: '11px 10px' }} align="center">
                  <HeaderCell>⚙️ Action</HeaderCell>

                  <Cell>
                    {(rowData) => (
                      <Button
                        appearance="link"
                        onClick={() => {
                          setFormData(rowData)
                          setSingleData(rowData)
                          setOpen(true)
                        }}
                        style={{ padding: '0px' }}
                      >
                        Edit
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
                  // total={totalRows}
                  // activePage={page}
                  // onChangePage={setPage}
                />
              </div>
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>
          <Modal.Title>Update Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Input style={{ width: 300 }} placeholder="Add Mac Address" />
            <Input style={{ width: 300 }} placeholder="Add URL" />
            <Input style={{ width: 300 }} placeholder="Add Username" />
            <Input style={{ width: 300 }} placeholder="Add Password" /> */}
          <Form alignItems="center">
            <Form.Group controlId="macAddress">
              <Form.ControlLabel>MacAddress</Form.ControlLabel>
              <Form.Control
                name="macAddress"
                value={formData.macAddress}
                onChange={(value) => changeHandler(value, 'macAddress')}
                placeholder="Add Mac Address"
              />

              <Button
                appearance="primary"
                color="violet"
                startIcon={<MagicIcon />}
                style={{
                  marginLeft: '10px',
                  background: 'linear-gradient(135deg, #6e00ff, #8e2de2)',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(110, 0, 255, 0.4)',
                  transition: 'all 0.3s ease-in-out',
                }}
                onClick={async () => {
                  const mac = await generateUniqueMacAddress()
                  changeHandler(mac, 'macAddress')
                }}
              >
                Generate MAC Address
              </Button>
            </Form.Group>
            <Form.Group controlId="url">
              <Form.ControlLabel>URL</Form.ControlLabel>
              <Form.Control
                name="url"
                value={formData.url}
                onChange={(value) => changeHandler(value, 'url')}
                placeholder="Add URL"
              />
            </Form.Group>
            <Form.Group controlId="username">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control
                name="username"
                value={formData.username}
                onChange={(value) => changeHandler(value, 'username')}
                placeholder="Add Username"
              />
              <Button
                appearance="primary"
                color="violet"
                startIcon={<MagicIcon />}
                style={{
                  marginLeft: '10px',
                  background: 'linear-gradient(135deg, #6e00ff, #8e2de2)',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(110, 0, 255, 0.4)',
                  transition: 'all 0.3s ease-in-out',
                }}
                onClick={async () => {
                  console.log('Row Data :', singleData)
                  const username = generateUsername(singleData.trial.name, singleData.trial.phone)
                  changeHandler(username, 'username')
                }}
              >
                Generate Username
              </Button>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control
                rows={5}
                name="password"
                value={formData.password}
                onChange={(value) => changeHandler(value, 'password')}
                placeholder="Add Password"
              />
              <Button
                appearance="primary"
                color="violet"
                startIcon={<MagicIcon />}
                style={{
                  marginLeft: '10px',
                  background: 'linear-gradient(135deg, #6e00ff, #8e2de2)',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px rgba(110, 0, 255, 0.4)',
                  transition: 'all 0.3s ease-in-out',
                }}
                onClick={async () => {
                  const password = generatePassword(singleData.trial.name, singleData.trial.phone)
                  changeHandler(password, 'password')
                }}
              >
                Generate Password
              </Button>
            </Form.Group>
            <Form.Group controlId="textarea-6">
              <Form.ControlLabel>Status</Form.ControlLabel>
              <SelectPicker
                name="status"
                style={{ width: '54%' }}
                value={formData.status}
                data={status}
                searchable={false}
                onChange={(value) => changeHandler(value, 'status')}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <Button appearance="primary" style={{ cursor: 'wait' }}>
              <Loader></Loader>
            </Button>
          ) : (
            <Button appearance="primary" onClick={submitHandler}>
              Submit
            </Button>
          )}

          <Button onClick={() => setOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={openAddMonth} onClose={() => setOpenAddMonth(false)}>
        <Modal.Header>
          <Modal.Title>🔋 Add Month</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectPicker
            data={monthOptions}
            searchable={false}
            style={{ width: '85%', marginRight: '1rem' }}
            placeholder="Select duration"
            onChange={(value) => setAddMonthValue(value)}
            value={addMonthValue}
            placement="bottom"
          />
          <Button appearance="primary" onClick={addMonthHandler}>
            Add
          </Button>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/* Modal for Confirmation */}
      <Modal open={showModal} onClose={handleConfirm}>
        <Modal.Header>
          <Modal.Title>New Activation Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Activation ID:</b> {notificationData?.activationId}
          </p>
          <p>Please confirm once you have seen this notification.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirm} appearance="primary">
            I Have Read
          </Button>
        </Modal.Footer>
      </Modal>

      <SaleDetailsModal
        openDetails={openDetails}
        setOpenDetails={setOpenDetails}
        singleData={singleData}
        trial={true}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
      />

      <ActivationDrawer
        rowData={singleData}
        calback={false}
        openWithHeader={openWithHeader}
        setOpenWithHeader={setOpenWithHeader}
      />
    </div>
  )
}

export default TrialActivation
