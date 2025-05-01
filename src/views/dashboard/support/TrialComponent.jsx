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
import { baseUrl } from '../../../API/Api'
// Rsuite Components
import { Button, Stack } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
import LiveTimerCellTrial from './LiveTimerCellTrial.jsx'

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
// import Loader from '../../../components/loader/Loader.jsx'
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

const status = [
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Cancelled', value: 'cancelled' },
]

const StatusCell = ({ rowData, dataKey, onCellClick, ...props }) => {
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
    // padding: '2px 8px',
    marginTop: '-0.5rem',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: 100,
    fontWeight: 500,
    cursor: 'pointer', // make it look clickable
  }

  return (
    <Cell {...props}>
      <span
        style={style}
        onClick={() => {
          if (onCellClick) onCellClick(rowData)
        }}
      >
        {status}
      </span>
    </Cell>
  )
}

const TrialComponent = () => {
  const [compact, setCompact] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [showHeader, setShowHeader] = React.useState(true)
  const [hover, setHover] = React.useState(true)
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key))
  const { Column, HeaderCell, Cell } = Table

  const columns = defaultColumns.filter((column) => columnKeys.some((key) => key === column.key))
  const CustomCell = compact ? CompactCell : Cell
  const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell

  const userID = JSON.parse(localStorage.getItem('user'))

  const trial_url = `${baseUrl}/trial/team/${userID.teamId}`
  const trial_update_url = `${baseUrl}/trial`

  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [editSale, setEditSale] = useState(false)
  const [singleTrialDetails, setSingleTrialDetails] = useState(null)

  async function getAllTrialCustomer() {
    try {
      const req = await fetch(trial_url)
      const res = await req.json()
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllTrialCustomer()
    // getAllEmpCustomer()
  }, [])

  const [formData, setFormData] = useState({
    status: '',
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClose = () => setOpen(false)

  async function updateHandler() {
    try {
      setLoading(true)
      const response = await fetch(`${trial_update_url}/${singleTrialDetails._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: formData.status }), // send only status
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      toast.success('Status Updated Successfully')
      getAllTrialCustomer()
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
        {/* <AppSidebar /> */}
        <div>
          {/* <AppHeader /> */}
          <div>
            <div>
              <Stack justifyContent="space-between" spacing={16}>
                <h3> Trial-Customers List 📅</h3>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <TagPicker
                    data={defaultColumns}
                    labelKey="label"
                    valueKey="key"
                    value={columnKeys}
                    onChange={setColumnKeys}
                    cleanable={false}
                  />
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
                  <Column key="name" width={150} fixed>
                    <HeaderCell>🧑 Customer Name</HeaderCell>
                    <Cell dataKey="name" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('email') && (
                  <Column key="email" width={200}>
                    <HeaderCell>📧 Email</HeaderCell>
                    <Cell dataKey="email" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('phone') && (
                  <Column key="phone" width={150}>
                    <HeaderCell>📞 Contact No.</HeaderCell>
                    <Cell dataKey="phone" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('address') && (
                  <Column key="address" width={200}>
                    <HeaderCell>📍 Address</HeaderCell>
                    <Cell dataKey="address" style={{ padding: '4px 10px' }} />
                  </Column>
                )}

                {columnKeys.includes('address') && (
                  <Column key="address" width={100}>
                    <HeaderCell>🧾 Plan</HeaderCell>
                    <Cell dataKey="plan" style={{ padding: '4px 10px' }} />
                  </Column>
                )}
                {columnKeys.includes('address') && (
                  <Column key="address" width={120}>
                    <HeaderCell>📱 Device</HeaderCell>
                    <Cell dataKey="device" style={{ padding: '4px 10px' }} />
                  </Column>
                )}

                {columnKeys.includes('status') && (
                  <Column key="status" width={120} align="center">
                    <HeaderCell>📊 Status</HeaderCell>
                    <StatusCell
                      dataKey="status"
                      onCellClick={(rowData) => {
                        setFormData(rowData)
                        setSingleTrialDetails(rowData)
                        setEditSale(true)
                        setOpen(true)
                      }}
                    />
                  </Column>
                )}

                {columnKeys.includes('validation') && (
                  <Column key="validation" width={200} align="center">
                    <HeaderCell>⏰ Time Left</HeaderCell>
                    <LiveTimerCellTrial dataKey="validation" />
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
          {/* <AppFooter /> */}
        </div>
        <Modal backdrop="static" size="sm" open={open}>
          <Modal.Header>
            <Modal.Title>Trial Status</Modal.Title>
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
      </div>
    </>
  )
}

export default TrialComponent
