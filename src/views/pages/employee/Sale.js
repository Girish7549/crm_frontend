import React, { useEffect, useState, createRef, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { rgbToHex } from '@coreui/utils'
import { DocsLink } from 'src/components'
import { AppFooter, AppHeader, AppSidebar } from '../../../components'
import ArowBackIcon from '@rsuite/icons/ArowBack'
import TrashIcon from '@rsuite/icons/Trash'
import CloseIcon from '@rsuite/icons/Close'
import saleImage from '../../../assets/images/sales.png'

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
import Loader from '../../../components/loader/Loader'
import InvoiceTemplate from '../../../components/employee/InvoiceTemplate'
import InvoiceDrawer from '../../../components/employee/InvoiceDrawer'
import { baseUrl } from '../../../API/Api'
// import TrashIcon from '@rsuite/icons/Trash';
import { Trash2, CirclePlus } from 'lucide-react'

// import { mockUsers } from '../../../data/mock';

const { Column, HeaderCell, Cell } = Table
// const data = mockUsers(20);

const CompactCell = (props) => <Cell {...props} style={{ padding: 4 }} />
const CompactHeaderCell = (props) => <HeaderCell {...props} style={{ padding: 4 }} />

const defaultColumns = [
  {
    key: 'customer',
    label: 'Customer Name',
    fixed: true,
    width: 200,
  },
  {
    key: 'saleItemsSummary',
    label: 'Plans & Devices',
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
    label: 'Activation',
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
    key: 'invoiceNumber',
    label: 'Invoice',
    width: 150,
  },
]

const StatusCell = ({ rowData, dataKey, ...props }) => {
  const status = rowData[dataKey]
  const isPending = status.toLowerCase() === 'pending'
  const isCompleted = status.toLowerCase() === 'completed'
  const isDone = status.toLowerCase() === 'done'

  const style = {
    backgroundColor: isPending
      ? '#fff3cd'
      : isCompleted
        ? '#d4edda'
        : isDone
          ? '#d4edda'
          : '#f8f9fa',
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

const customers = [
  { label: 'Customer 1', value: 'cust1' },
  { label: 'Customer 2', value: 'cust2' },
]

const paymentMethod = [
  { label: 'Paytm', value: 'Paytm' },
  { label: 'Zelle', value: 'Zelle' },
  { label: 'GPay', value: 'GPay' },
  { label: 'Payneeor', value: 'Payneeor' },
  { label: 'PhonePay', value: 'PhonePay' },
  { label: 'AmazonPay', value: 'AmazonPay' },
  { label: 'PayPal', value: 'PayPal' },
]

const plans = [
  { label: 'Gold', value: 'gold' },
  { label: 'Platinum', value: 'platinum' },
  { label: 'Diamond', value: 'diamond' },
]

const Sale = () => {
  const [compact, setCompact] = React.useState(true)
  const [bordered, setBordered] = React.useState(true)
  const [showHeader, setShowHeader] = React.useState(true)
  const [hover, setHover] = React.useState(true)
  const [columnKeys, setColumnKeys] = React.useState(defaultColumns.map((column) => column.key))
  console.log('Columnn Key :', columnKeys)

  const userID = JSON.parse(localStorage.getItem('user'))

  const get_emp_sale = `${baseUrl}/sales/employee/${userID.id}`
  const url_employee_sale = `${baseUrl}/sale`
  const get_all_services = `${baseUrl}/service`
  const get_employee_customer = `${baseUrl}/customer/employee/${userID.id}`

  const [open, setOpen] = useState(false)
  const [openSaleDetail, setOpenSaleDetail] = useState(false)
  const [openWithHeader, setOpenWithHeader] = React.useState(false)
  const [openInvoiceDrawer, setOpenInvoiceDrawer] = React.useState(false)
  const [paymentURL, setPaymentURL] = useState(null)
  const [service, setService] = useState(null)
  const [data, setData] = useState([])
  const [page, setPage] = React.useState(1)
  const [fileUrl, setFileUrl] = useState([])
  const [loading, setLoading] = useState(false)
  const [saleData, setSaleData] = useState(null)
  const [rowData, setRowData] = useState(null)
  const [singleSaleDetails, setSingleSaleDetails] = useState(null)
  const [editSale, setEditSale] = useState(false)
  const [totalRows, setTotalRows] = useState(false)
  const uploadImgRef = useRef(null)

  const [formData, setFormData] = useState({
    customer: '',
    service: userID?.service?._id,
    saleItems: [
      {
        plan: '',
        amount: 0,
        qty: 1,
        devices: [
          {
            deviceType: '',
            customPrice: 0,
            month: 1,
          },
        ],
      },
    ],
    paymentProof: [],
    paymentMethod: '',
    assignedEmployee: userID.id,
    status: 'pending',
  })
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...formData.saleItems]
    newPlans[index][field] = value
    setFormData((prev) => ({ ...prev, saleItems: newPlans }))
  }

  // const handleDeviceChange = (planIndex, deviceIndex, field, value) => {
  //   const newPlans = [...formData.saleItems]
  //   newPlans[planIndex].devices[deviceIndex][field] = value
  //   setFormData((prev) => ({ ...prev, saleItems: newPlans }))
  // }
  const handleDeviceChange = (planIndex, deviceIndex, field, value) => {
    const newPlans = [...formData.saleItems]
    newPlans[planIndex].devices[deviceIndex][field] = value

    if (field === 'customPrice') {
      const totalAmount = newPlans[planIndex].devices.reduce(
        (sum, device) => sum + Number(device.customPrice),
        0,
      )
      newPlans[planIndex].amount = totalAmount
    }
    setFormData((prev) => ({ ...prev, saleItems: newPlans }))
  }

  // console.log('Form Data :', formData)

  const addPlan = () => {
    setFormData((prev) => {
      if (prev.saleItems.length >= 3) {
        alert('You can add a maximum of 3 plans.')
        return prev
      }

      return {
        ...prev,
        saleItems: [
          ...prev.saleItems,
          { plan: '', amount: 0, qty: 1, devices: [{ deviceType: '', customPrice: 0, month: 1 }] },
        ],
      }
    })
  }

  const removePlan = (index) => {
    setFormData((prev) => ({
      ...prev,
      saleItems: prev.saleItems.filter((_, i) => i !== index),
    }))
  }

  const addDevice = (planIndex) => {
    const newPlans = [...formData.saleItems]
    newPlans[planIndex].devices.push({ deviceType: '', customPrice: 0, month: 1 })
    newPlans[planIndex].qty = newPlans[planIndex].qty + 1
    setFormData((prev) => ({ ...prev, saleItems: newPlans }))
  }

  const removeDevice = (planIndex, deviceIndex) => {
    const newPlans = [...formData.saleItems]
    newPlans[planIndex].devices.splice(deviceIndex, 1)
    setFormData((prev) => ({ ...prev, saleItems: newPlans }))
  }

  function uploadHandler() {
    uploadImgRef.current.click()
  }

  // function fileHandler(event) {
  //   console.log('HI...', event.target.files)
  //   const file = event.target.files[0]
  //   console.log('file data :', file)
  //   if (file && file.type.startsWith('image/')) {
  //     const imageUrl = URL.createObjectURL(file)
  //     console.log('image path :', imageUrl)
  //     setFileUrl([imageUrl])
  //     // setFileUrl((prev) => ({
  //     //   ...prev,
  //     //   imageUrl,
  //     // }))
  //     setFormData((prev) => ({
  //       ...prev,
  //       paymentProof: [file],
  //     }))
  //   } else {
  //     console.error('Please upload a valid image file')
  //   }
  // }
  function fileHandler(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (file.type.startsWith('image/')) {
    const imageUrl = URL.createObjectURL(file);

    console.log('File selected:', file);
    console.log('Preview URL:', imageUrl);

    // Set preview image URL
    setFileUrl([...fileUrl, imageUrl]);

    // Set file in formData (as array for consistency)
    setFormData((prev) => ({
      ...prev,
      paymentProof: [...formData.paymentProof, file],
    }));
  } else {
    console.error('Please upload a valid image file.');
    alert('Invalid file type. Please upload an image.');
  }
}


  useEffect(() => {
    async function getService() {
      try {
        const req = await fetch(get_all_services)
        const res = await req.json()
        console.log('Services Data : ', res)
        setService(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getService()
    getAllCustomer()
    getAllEmpSale()
  }, [])

  function showSaleDetails(data) {
    setOpenSaleDetail(true)
    console.log('Sale Details :', data)
    setSingleSaleDetails(data)
  }

  async function getAllCustomer() {
    try {
      const req = await fetch(get_employee_customer)
      const res = await req.json()
      console.log('Customer Data Based On Employee :', res)
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleOpen = (value) => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
    setEditSale(false)
    setFileUrl(null)
    setFormData({
      customer: '',
      service: '',
      saleItems: [
        {
          plan: '',
          amount: 0,
          qty: 1,
          devices: [
            {
              deviceType: '',
              customPrice: 0,
              month: 1,
            },
          ],
        },
      ],
      paymentProof: '',
      paymentMethod: '',
      assignedEmployee: userID.id,
      status: 'pending',
    })
  }

  function changeHandler(value, event) {
    const name = event.target.name || 'purchasedService'
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  // console.log('Form Data :', formData)
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

  async function getAllEmpSale(page = 1) {
    try {
      const req = await fetch(`${get_emp_sale}?page=${page}`)
      const res = await req.json()
      console.log('Employee Sale :', res.data)
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

  useEffect(() => {
    getAllEmpSale(page)
  }, [page])

  async function submitHandler() {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
  
      formDataToSend.append('customer', formData.customer);
      formDataToSend.append('service', formData.service);
      formDataToSend.append('saleItems', JSON.stringify(formData.saleItems));
      formDataToSend.append('paymentMethod', formData.paymentMethod);
      formDataToSend.append('assignedEmployee', formData.assignedEmployee);
      formDataToSend.append('status', formData.status);
      // formDataToSend.append('paymentProof', formData.paymentProof[0])

      // Fix for multiple files
      formData.paymentProof.forEach((file) => {
        formDataToSend.append('paymentProof', file);
      });
  
      const req = await fetch(url_employee_sale, {
        method: 'POST',
        body: formDataToSend,
        mode: 'cors',
      });
  
      const res = await req.json();
      if (!req.ok) throw new Error(res.message || 'Failed to submit');
  
      // Reset state
      setFormData({
        customer: '',
        service: '',
        saleItems: [
          {
            plan: '',
            amount: 0,
            qty: 1,
            devices: [
              {
                deviceType: '',
                customPrice: 0,
                month: 1,
              },
            ],
          },
        ],
        paymentProof: [],
        paymentMethod: '',
        assignedEmployee: userID.id,
        status: 'pending',
      });
      setFileUrl(null);
      getAllEmpSale();
      toast.success('Sale Created Successfully');
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }
  
  async function updateHandler1() {
    try {
      setLoading(true)
      console.log('Form Data:', formData)
      const formDataToSend = new FormData()
      formDataToSend.append('paymentProof', formData.paymentProof) // file object
      formDataToSend.append('customer', formData.customer)
      formDataToSend.append('service', formData.service)
      formDataToSend.append('paymentMethod', formData.paymentMethod)
      formDataToSend.append('assignedEmployee', formData.assignedEmployee)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('saleItems', JSON.stringify(formData.saleItems))

      const response = await fetch(`${url_employee_sale}/${singleSaleDetails._id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      console.log('Form Data:', response)

      setFormData({
        customer: '',
        service: '',
        saleItems: [
          {
            plan: '',
            amount: 0,
            qty: 1,
            devices: [
              {
                deviceType: '',
                customPrice: 0,
                month: 1,
              },
            ],
          },
        ],
        paymentProof: '',
        paymentMethod: '',
        assignedEmployee: userID.id,
        status: 'pending',
      })
      getAllEmpSale()
      setFileUrl(null)
      toast.success('Updated Successfully')
      handleClose()
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }
  async function updateHandler() {
    try {
      setLoading(true);
  
      const formDataToSend = new FormData();
  
      formDataToSend.append('customer', formData.customer);
      formDataToSend.append('service', formData.service);
      formDataToSend.append('saleItems', JSON.stringify(formData.saleItems));
      formDataToSend.append('paymentMethod', formData.paymentMethod);
      formDataToSend.append('assignedEmployee', formData.assignedEmployee);
      formDataToSend.append('status', formData.status);
  
      // Process paymentProofs (File or URL)
      for (let proof of formData.paymentProof) {
        if (typeof proof === 'string') {
          // Convert image URL to File
          const response = await fetch(proof);
          const blob = await response.blob();
          const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
          formDataToSend.append('paymentProof', file);
        } else {
          // Already a File
          formDataToSend.append('paymentProof', proof);
        }
      }
  
      const response = await fetch(`${url_employee_sale}/${singleSaleDetails._id}`, {
        method: 'PUT',
        body: formDataToSend, // no headers needed
      });
  
      if (!response.ok) {
        throw new Error('Failed to update sale');
      }
  
      // Reset
      setFormData({
        customer: '',
        service: '',
        saleItems: [
          {
            plan: '',
            amount: 0,
            qty: 1,
            devices: [
              {
                deviceType: '',
                customPrice: 0,
                month: 1,
              },
            ],
          },
        ],
        paymentProof: [],
        paymentMethod: '',
        assignedEmployee: userID.id,
        status: 'pending',
      });
  
      setFileUrl(null);
      getAllEmpSale();
      toast.success('Updated Successfully');
      handleClose();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }
  

  // const dummyInvoiceData = {
  //   _id: "67f0c0bd557388fae087da1e",
  //   invoiceNumber: "INV-1744781848781",
  //   customer: {
  //     _id: "67ea4ab5ce3a06fbb8d5f041",
  //     name: "Priyanshu Yadav",
  //     email: "priyanshu.yadav@gamil.com",
  //     phone: "8833746193",
  //     address: "Shikohabad , Uttar Pradesh",
  //     refferCode: "priy6193",
  //     status: "sale"
  //   },
  //   service: "67de999556b96516c9c5902b", // You may replace with populated service name when needed
  //   saleItems: [
  //     {
  //       status: "unpaid",
  //       plan: "Platinum",
  //       amount: 599,
  //       qty: 2,
  //       devices: [
  //         {
  //           deviceType: "Laptop",
  //           customPrice: 599,
  //           month: 12
  //         }
  //       ]
  //     },
  //     {
  //       status: "unpaid",
  //       plan: "Gold",
  //       amount: 1298,
  //       qty: 2,
  //       devices: [
  //         {
  //           deviceType: "Smartphone",
  //           customPrice: 299,
  //           month: 14
  //         },
  //         {
  //           deviceType: "Television",
  //           customPrice: 999,
  //           month: 16
  //         }
  //       ]
  //     },
  //     {
  //       status: "unpaid",
  //       plan: "Diamond",
  //       amount: 3197,
  //       qty: 3,
  //       devices: [
  //         {
  //           deviceType: "Alexa",
  //           customPrice: 399,
  //           month: 12
  //         },
  //         {
  //           deviceType: "Home Threater",
  //           customPrice: 799,
  //           month: 16
  //         },
  //         {
  //           deviceType: "MacBook",
  //           customPrice: 1999,
  //           month: 24
  //         }
  //       ]
  //     }
  //   ],
  //   totalAmount: 5094,
  //   paymentProof: "https://res.cloudinary.com/dxziqnbub/image/upload/v1743831089/sales/paymentProofs/file.png",
  //   paymentMethod: "Zelle",
  //   assignedEmployee: {
  //     _id: "67dea54fa5695dd9087a7db6",
  //     name: "Honey Singh",
  //     role: "sales_agent"
  //   },
  //   status: "pending",
  //   createdAt: "2025-04-05T05:33:49.000Z"
  // };

  const handleDeleteImage = (indexToRemove) => {
    setFileUrl((prev) => prev.filter((_, i) => i !== indexToRemove));
    setFormData((prev) => ({
      ...prev,
      paymentProof: prev.paymentProof.filter((_, i) => i !== indexToRemove),
    }));
  };
  

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
                  {' '}
                  <img src={saleImage} height={50} alt="sale-image" /> Create Sale
                </h3>

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

                  <Button appearance="primary" onClick={handleOpen}>
                    Create
                  </Button>
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
                  <Column key="customerName" width={200} fixed>
                    <HeaderCell>🧑 Customer Name</HeaderCell>
                    <Cell dataKey="customerName" />
                  </Column>
                )}

                {columnKeys.includes('saleItemsSummary') && (
                  <Column key="saleItemsSummary" width={400} fullText>
                    <HeaderCell>📦 Plans & 📱 Devices</HeaderCell>
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

                {columnKeys.includes('totalAmount') && (
                  <Column key="totalAmount" width={150} align="center">
                    <HeaderCell>💰 Total Amount</HeaderCell>
                    <Cell dataKey="totalAmount" />
                  </Column>
                )}

                {columnKeys.includes('paymentMethod') && (
                  <Column key="paymentMethod" width={180} align="center">
                    <HeaderCell>💳 Payment Method</HeaderCell>
                    <Cell dataKey="paymentMethod" />
                  </Column>
                )}

                {columnKeys.includes('paymentProof') && (
                  <Column key="paymentProof" width={150} align="center" fullText>
                    <HeaderCell> 📷 Payment Proof</HeaderCell>
                    <Cell dataKey="paymentProof" style={{ padding: '4px 10px' }}>
                      {(rowData) =>
                        rowData.paymentProof ? (
                          <Button
                            onClick={() => {
                              setOpenWithHeader(true)
                              setPaymentURL(rowData.paymentProof)
                            }}
                            style={{ paddingBlock: '0px', marginTop: '0px' }}
                            appearance="ghost"
                          >
                            {' '}
                            View{' '}
                          </Button>
                        ) : (
                          'N/A'
                        )
                      }
                    </Cell>
                  </Column>
                )}
                {/* {columnKeys.includes('invoiceNumber') && ( */}
                <Column key="invoiceNumber" width={150} align="center" fullText>
                  <HeaderCell>🧾 Invoice</HeaderCell>
                  <Cell dataKey="invoiceNumber" style={{ padding: '4px 10px' }}>
                    {(rowData) => (
                      <Button
                        onClick={() => {
                          setOpenInvoiceDrawer(true)
                          setRowData(rowData)
                        }}
                        style={{ paddingBlock: '0px', marginTop: '0px' }}
                        appearance="primary"
                      >
                        {' '}
                        View{' '}
                      </Button>
                    )}
                  </Cell>
                </Column>
                {/* )} */}

                {columnKeys.includes('status') && (
                  <Column key="status" width={150} align="center">
                    <HeaderCell>📊 Status</HeaderCell>
                    <StatusCell dataKey="status" />
                  </Column>
                )}
                {columnKeys.includes('activation') && (
                  <Column key="activation" width={150} align="center">
                    <HeaderCell>⚡ Activation</HeaderCell>
                    <StatusCell dataKey="activation" />
                  </Column>
                )}

                {columnKeys.includes('createdAt') && (
                  <Column key="createdAt" width={200} align="center">
                    <HeaderCell>🕒 Created At</HeaderCell>
                    <Cell dataKey="createdAt" />
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
                          setFileUrl(rowData.paymentProof)
                          setSingleSaleDetails(rowData)
                          setEditSale(true)
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
                  total={totalRows}
                  activePage={page}
                  onChangePage={setPage}
                />
              </div>
            </div>
          </div>
          <AppFooter />
          {/* <InvoiceTemplate dummyInvoiceData={dummyInvoiceData} /> */}
        </div>

        {/* Create && Update Sale  */}
        <Modal backdrop="static" size="lg" open={open} onClose={handleClose}>
          <Modal.Header>
            <Modal.Title>Sale Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form layout="horizontal">
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                {/* Customer Selection */}
                <Form.Group style={{ display: 'flex', width: '45%' }}>
                  <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                    Customer
                  </Form.ControlLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <SelectPicker
                      data={data.map((item) => ({ label: item.name, value: item._id }))}
                      style={{ width: '100%' }}
                      value={formData.customer._id}
                      onChange={(value) => handleInputChange('customer', value)}
                    />
                    <p style={{ color: 'purple' }}>
                      {' '}
                      {data.find((item) => item._id === formData.customer)?.email}{' '}
                    </p>
                  </div>
                </Form.Group>

                {/* Service Selection */}
                <Form.Group style={{ display: 'flex', width: '45%' }}>
                  <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                    Service
                  </Form.ControlLabel>
                  <SelectPicker
                    readOnly
                    data={service?.map((item) => ({ label: item.name, value: item._id }))}
                    style={{ width: '100%' }}
                    value={formData.service}
                    onChange={(value) => handleInputChange('service', value)}
                  />
                </Form.Group>
              </div>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
                {/* Payment Method */}
                <Form.Group style={{ display: 'flex', width: '45%' }}>
                  <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                    Payment Method
                  </Form.ControlLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <SelectPicker
                      data={paymentMethod}
                      style={{ width: '100%' }}
                      value={formData.paymentMethod}
                      onChange={(value) => handleInputChange('paymentMethod', value)}
                    />
                  </div>
                </Form.Group>

                {/* Payment Proof */}
                <Form.Group style={{ display: 'flex', width: '45%' }}>
                  <Form.ControlLabel style={{ textAlign: 'left', width: 'fit-content' }}>
                    Payment Proof
                  </Form.ControlLabel>
                  <div style={{display:'flex', gap:'4px', alignItems:'center'}}>
                    {fileUrl?.length == 0 && (
                      <Button appearance="primary" onClick={uploadHandler}>
                        Upload Image
                      </Button>
                    )}
                   
                    <input
                      ref={uploadImgRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={fileHandler}
                    />
                    {fileUrl && (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div
                          style={{
                            display: 'flex',
                            width: '80%',
                            alignItems: 'center',
                            overflowX: 'scroll',
                          }}
                        >
                          {fileUrl?.map((img, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                              <Button
                                style={{
                                  color: 'white',
                                  padding: '2px',
                                  backgroundColor: '#ff3838',
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                }}
                                onClick={() => handleDeleteImage(index)}
                              >
                                <Trash2 style={{ width: '20px' }} />
                              </Button>
                              <img
                                src={img}
                                alt="image"
                                style={{
                                  padding: '4px',
                                  paddingTop: '40px',
                                  objectFit: 'contain',
                                  minWidth: '180px',
                                  height: '180px',
                                }}
                              />
                            </div>
                          ))}

                        </div>
                      </div>
                    )}
                     {
                      fileUrl?.length > 0 && (
                        <CirclePlus style={{cursor:'pointer'}} onClick={uploadHandler}/>
                      )
                    }
                   
                  </div>
                </Form.Group>
              </div>

              {/* Plan Sections */}
              {formData.saleItems.map((plan, planIndex) => (
                <Panel bordered key={planIndex} style={{ marginBottom: 10 }}>
                  <h5 style={{ color: '#2c64e3' }}>
                    Plan {planIndex + 1}{' '}
                    {planIndex > 0 && (
                      <Whisper
                        placement="top"
                        controlId="control-id-hover"
                        trigger="hover"
                        speaker={<Tooltip>Delete Plan {planIndex + 1}</Tooltip>}
                      >
                        <IconButton
                          icon={
                            <TrashIcon
                              style={{
                                backgroundColor: 'red',
                                width: '1.5rem',
                                height: '1.5rem',
                                color: 'white',
                                padding: '4px',
                                borderRadius: '4px',
                              }}
                            />
                          }
                          appearance="subtle"
                          size="xs"
                          onClick={() => removePlan(planIndex)}
                        />
                      </Whisper>
                    )}
                  </h5>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Plan Selection */}
                    <Form.Group>
                      <Form.ControlLabel style={{ textAlign: 'left' }}>
                        Choose Plan
                      </Form.ControlLabel>
                      <SelectPicker
                        data={plans}
                        style={{ width: '100%' }}
                        value={plan.plan}
                        searchable={false}
                        onChange={(value) => handlePlanChange(planIndex, 'plan', value)}
                      />
                    </Form.Group>

                    {/* Amount Input */}
                    <Form.Group style={{ width: 'min-content' }}>
                      <Form.ControlLabel style={{ textAlign: 'left' }}>Amount</Form.ControlLabel>
                      <Form.Control
                        style={{ width: '100%', cursor: 'not-allowed' }}
                        value={plan.amount}
                        readOnly
                        onChange={(value) => handlePlanChange(planIndex, 'amount', value)}
                      />
                    </Form.Group>

                    {/* Quantity Input */}
                    <Form.Group style={{ width: 'min-content' }}>
                      <Form.ControlLabel style={{ textAlign: 'left' }}>Quantity</Form.ControlLabel>
                      <Form.Control
                        readOnly
                        style={{ width: '80%', cursor: 'not-allowed' }}
                        value={plan.qty}
                        onChange={(value) => handlePlanChange(planIndex, 'qty', value)}
                      />
                    </Form.Group>
                  </div>

                  {/* Device Section */}
                  {plan.devices.map((device, deviceIndex) => (
                    <Panel
                      key={deviceIndex}
                      bordered
                      style={{ marginBottom: 2, padding: 0, backgroundColor: '#f6fafb' }}
                    >
                      <h6 style={{ color: '#2c64e3' }}>
                        Device {deviceIndex + 1}{' '}
                        {deviceIndex > 0 && (
                          <Whisper
                            placement="top"
                            controlId="control-id-hover"
                            trigger="hover"
                            speaker={<Tooltip>Delete Device {deviceIndex + 1}</Tooltip>}
                          >
                            <IconButton
                              icon={
                                <TrashIcon
                                  style={{
                                    backgroundColor: 'red',
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    color: 'white',
                                    padding: '4px',
                                    borderRadius: '4px',
                                  }}
                                />
                              }
                              appearance="subtle"
                              size="xs"
                              onClick={() => removeDevice(planIndex, deviceIndex)}
                            />
                          </Whisper>
                        )}
                      </h6>

                      <div
                        style={{
                          display: 'flex',
                          gap: '4rem',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <Form.Group style={{ width: '30%' }}>
                          <Form.ControlLabel style={{ textAlign: 'left', width: '100%' }}>
                            Device Type
                          </Form.ControlLabel>
                          <Form.Control
                            value={device.deviceType}
                            onChange={(value) =>
                              handleDeviceChange(planIndex, deviceIndex, 'deviceType', value)
                            }
                          />
                        </Form.Group>

                        <Form.Group style={{ width: '30%' }}>
                          <Form.ControlLabel style={{ textAlign: 'left', width: '100%' }}>
                            Custom Price
                          </Form.ControlLabel>
                          <InputNumber
                            style={{ width: '100%' }}
                            value={device.customPrice}
                            onChange={(value) =>
                              handleDeviceChange(planIndex, deviceIndex, 'customPrice', value)
                            }
                          />
                        </Form.Group>

                        <Form.Group style={{ width: '30%' }}>
                          <Form.ControlLabel style={{ textAlign: 'left', width: '100%' }}>
                            Month
                          </Form.ControlLabel>
                          <InputNumber
                            style={{ width: '100%' }}
                            value={device.month}
                            onChange={(value) =>
                              handleDeviceChange(planIndex, deviceIndex, 'month', value)
                            }
                          />
                        </Form.Group>
                      </div>
                    </Panel>
                  ))}

                  <Button appearance="ghost" onClick={() => addDevice(planIndex)}>
                    Add Device
                  </Button>
                </Panel>
              ))}

              <Button appearance="ghost" onClick={addPlan}>
                Add Another Plan
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ marginTop: '1rem' }}>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
            {loading ? (
              <Button onClick={submitHandler} appearance="primary" style={{ cursor: 'wait' }}>
                <Loader></Loader>
              </Button>
            ) : editSale ? (
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

            {/* {!loading ? (
              <Loader></Loader>
            ) : (
              <Button onClick={submitHandler} appearance="primary">
                {!loading ? <Loader></Loader> : 'Create'}Create
              </Button>
            )} */}
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
              <FlexboxGrid
                justify="center
                "
                align="center"
                style={{ flexWrap: 'wrap' }}
              >
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
          flexDirection={'column'}
        >
          <Drawer.Header>
            <Drawer.Title>Payment Proof</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <div
              style={{
                height: '100%',
              }}
            >
              {paymentURL?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="payment-proof"
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                />
              ))}
            </div>
          </Drawer.Body>
        </Drawer>

        <InvoiceDrawer
          openInvoiceDrawer={openInvoiceDrawer}
          setOpenInvoiceDrawer={setOpenInvoiceDrawer}
          rowData={rowData}
        />
      </div>
    </>
  )
}

export default Sale
