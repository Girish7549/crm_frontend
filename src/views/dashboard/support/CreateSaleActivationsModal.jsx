import React, { useState, useEffect } from 'react'
import { Button, Modal, SelectPicker } from 'rsuite'
import axios from 'axios'
import { baseUrl } from '../../../API/Api'
import { toast } from 'react-toastify'

const statusOptions = [{ label: 'Active', value: 'active' }]

const CreateSaleActivationsModal = ({
  open,
  handleClose,
  data,
  getAllEmpActivations,
  isEdit = false,
  singleRowData = null,
}) => {
  const userID = JSON.parse(localStorage.getItem('user'))

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ sale: '', customer: '', status: '' })
  const [devices, setDevices] = useState([])

  // Populate form and device info in edit mode
  useEffect(() => {
    if (isEdit && singleRowData) {
      setFormData({
        sale: singleRowData.sale,
        customer: singleRowData.customer._id,
        status: singleRowData.status || '',
      })

      setDevices([
        {
          ...singleRowData.deviceInfo,
          applicationName: singleRowData.applicationName || '',
          note: '', // hidden in edit
        },
      ])
    }
  }, [isEdit, singleRowData])

  // Reset form when switching to Create mode
  useEffect(() => {
    if (!isEdit && open) {
      setFormData({ sale: '', customer: '', status: '' })
      setDevices([])
    }
  }, [isEdit, open])

  const handleCustomerChange = (value) => {
    const selected = data.find((item) => item._id === value)
    if (selected) {
      const allDevices =
        selected.saleItems?.flatMap((item) =>
          item.devices.map((device) => ({
            ...device,
            plan: item.plan,
            applicationName: '',
            note: '',
          })),
        ) || []

      setDevices(allDevices)
      setFormData({
        sale: selected._id,
        customer: selected.customer._id,
        status: '',
      })
    }
  }

  const handleSubmit = async () => {
    if (!formData.sale || !formData.customer) {
      toast.warning('Please select a customer.')
      return
    }

    const device = devices[0]
    if (!device.applicationName.trim()) {
      toast.warning('Please enter an application name.')
      return
    }

    if (!isEdit && !device.note.trim()) {
      toast.warning('Please enter a note.')
      return
    }

    setLoading(true)
    try {
      if (isEdit) {
        const payload = {
          applicationName: device.applicationName,
          status: formData.status,
        }
        await axios.put(`${baseUrl}/activations/${singleRowData._id}`, payload)
        toast.success('Activation updated successfully!')
      } else {
        await Promise.all(
          devices.map((device) => {
            const payload = {
              sale: formData.sale,
              customer: formData.customer,
              applicationName: device.applicationName,
              assignedEmployee: userID.id,
              notes: [
                {
                  note: device.note,
                  employee: userID.id,
                },
              ],
              deviceInfo: {
                deviceType: device.deviceType,
                customPrice: device.customPrice,
                plan: device.plan,
                totalMonths: device.month,
              },
            }
            return axios.post(`${baseUrl}/activations`, payload)
          }),
        )
        toast.success('All activations created successfully!')
      }

      handleClose()
      getAllEmpActivations()
    } catch (error) {
      console.error(error)
      toast.error('❌ Operation failed. Check console for details.')
    } finally {
      setLoading(false)
      setDevices([])
      setFormData({ sale: '', customer: '', status: '' })
    }
  }

  return (
    <Modal size="md" open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>{isEdit ? 'Edit Activation' : 'Create Sale Activation'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Customer Picker */}
          <div>
            <label style={{ fontWeight: '600' }}>
              Select Customer<span className="text-danger">*</span>
            </label>
            <SelectPicker
              data={data.map((item) => ({
                label: `${item.customer.name}`,
                value: item._id,
              }))}
              style={{ width: '100%', marginTop: 8 }}
              value={formData.sale}
              onChange={handleCustomerChange}
              placeholder="Choose a customer"
              disabled={isEdit}
              searchable={!isEdit}
              cleanable={false}
            />
            <p style={{ color: 'purple', fontSize: '13px', marginTop: 5 }}>
              {data.find((item) => item.customer._id === formData.customer)?.customer?.email || ''}
            </p>
          </div>

          {/* Devices */}
          {devices.map((device, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #eee',
                borderRadius: 8,
                padding: 16,
                backgroundColor: '#fafafa',
              }}
            >
              <h6 style={{ marginBottom: 8, fontWeight: 600 }}>
                💻 Device {index + 1}: {device.deviceType}
              </h6>

              <div
                style={{
                  marginBottom: 10,
                  fontSize: '14px',
                  color: '#444',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <div>
                  <strong>🔤 Type:</strong> {device.deviceType}
                </div>
                <div>
                  <strong>💲 Price:</strong> ${device.customPrice}
                </div>
                <div>
                  <strong>✨ Plan:</strong> {device.plan}
                </div>
                <div>
                  <strong>🗓️ Months:</strong> {device.month}
                </div>
              </div>

              {/* Application Name */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontWeight: 500 }}>
                  📱 Application Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={device.applicationName || ''}
                  onChange={(e) => {
                    const updated = [...devices]
                    updated[index].applicationName = e.target.value
                    setDevices(updated)
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ADD8E6',
                    width: '100%',
                    marginTop: 6,
                  }}
                />
              </div>

              {/* Note (Only for Create) */}
              {!isEdit && (
                <div>
                  <label style={{ fontWeight: 500 }}>
                    📝 Note<span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows="2"
                    value={device.note || ''}
                    onChange={(e) => {
                      const updated = [...devices]
                      updated[index].note = e.target.value
                      setDevices(updated)
                    }}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #ADD8E6',
                      width: '100%',
                      resize: 'none',
                      marginTop: 6,
                    }}
                  />
                </div>
              )}

              {/* Status (Only for Edit) */}
              {isEdit && (
                <div style={{ marginTop: 12 }}>
                  <label style={{ fontWeight: 500 }}>
                    📊 Status<span className="text-danger">*</span>
                  </label>
                  <SelectPicker
                    data={statusOptions}
                    style={{ width: '100%', marginTop: 8 }}
                    value={formData.status}
                    onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                    placeholder="Select status"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={handleSubmit} appearance="primary" loading={loading}>
          {isEdit ? 'Update' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateSaleActivationsModal
