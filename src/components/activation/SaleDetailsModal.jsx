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
const months = Array.from({ length: 13 }, (_, i) => ({
  label: `${i + 1} Month${i > 0 ? 's' : ''}`,
  value: i + 1,
}))

const SaleDetailsModal = ({ openDetails, setOpenDetails, singleData, trial = false }) => {
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

  return (
    <Modal size="lg" open={openDetails} onClose={() => setOpenDetails(false)}>
      <Modal.Header>
        <Modal.Title>
          📋 <b style={{ fontSize: 18 }}>Activation Details</b>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Customer Info */}
        <Panel bordered shaded header="🧑 Customer Information" style={{ marginBottom: 10 }}>
          <FlexboxGrid>
            <InfoRow
              icon={<MdPerson color="#3498db" />}
              label="Name"
              value={singleData?.customer?.name}
            />
            <InfoRow
              icon={<MdEmail color="#9b59b6" />}
              label="Email"
              value={singleData?.customer?.email}
            />
            <InfoRow
              icon={<MdPhone color="#e67e22" />}
              label="Phone"
              value={singleData?.customer?.phone}
            />
            <InfoRow
              icon={<MdLocationOn color="#2ecc71" />}
              label="Address"
              value={singleData?.customer?.address}
            />
          </FlexboxGrid>
        </Panel>

        {/* Device & Plan Info */}
        <Panel bordered shaded header="💻 Device & Plan Info" style={{ marginBottom: 10 }}>
          <FlexboxGrid>
            <InfoRow
              icon={<MdDevices color="#16a085" />}
              label="Device Type"
              value={
                trial === false ? singleData?.deviceInfo?.deviceType : singleData?.trial?.device
              }
            />
            <InfoRow
              icon={<MdSecurity color="#d35400" />}
              label="Plan"
              value={trial === false ? singleData?.deviceInfo?.plan : singleData?.trial?.plan}
            />
            {!trial && (
              <InfoRow
                icon={<MdDateRange color="#2980b9" />}
                label="Total Months"
                value={`${singleData?.deviceInfo?.totalMonths} Months`}
              />
            )}
            {!trial && (
              <InfoRow
                icon={<MdSecurity color="#8e44ad" />}
                label="Price"
                value={`₹${singleData?.deviceInfo?.customPrice}`}
              />
            )}
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
              value={singleData?.url} />
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
        {!trial && (
          <Panel bordered shaded header="📅 Set New Duration (Months)">
            <SelectPicker
              data={monthOptions}
              searchable={false}
              style={{ width: '85%', marginRight: '1rem' }}
              placeholder="Select duration"
              defaultValue={singleData?.currentMonth}
              placement="top"
            />
            <Button appearance="primary">Add Month</Button>
          </Panel>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => setOpenDetails(false)} appearance="primary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    // <Modal size="full" open={openDetails} onClose={() => setOpenDetails(false)}>
    //   <Modal.Header>
    //     <Modal.Title>
    //       📋 <b style={{ fontSize: 18 }}>Activation Details</b>
    //     </Modal.Title>
    //   </Modal.Header>

    //   <Modal.Body style={{ background: '#f5f9fa', padding: 30 }}>
    //     <div style={{ maxWidth: 1000, margin: '0 auto' }}>
    //       {/* Customer Info */}
    //       <Panel bordered shaded header="🧑 Customer Information" style={{ marginBottom: 10 ,  background: '#ffffff'}}>
    //         <FlexboxGrid>
    //           <InfoRow
    //             icon={<MdPerson color="#3498db" />}
    //             label="Name"
    //             value={singleData?.customer?.name}
    //           />
    //           <InfoRow
    //             icon={<MdEmail color="#9b59b6" />}
    //             label="Email"
    //             value={singleData?.customer?.email}
    //           />
    //           <InfoRow
    //             icon={<MdPhone color="#e67e22" />}
    //             label="Phone"
    //             value={singleData?.customer?.phone}
    //           />
    //           <InfoRow
    //             icon={<MdLocationOn color="#2ecc71" />}
    //             label="Address"
    //             value={singleData?.customer?.address}
    //           />
    //         </FlexboxGrid>
    //       </Panel>

    //       {/* Device & Plan Info */}
    //       <Panel bordered shaded header="💻 Device & Plan Info" style={{ marginBottom: 10 ,  background: '#ffffff'}}>
    //         <FlexboxGrid>
    //           <InfoRow
    //             icon={<MdDevices color="#16a085" />}
    //             label="Device Type"
    //             value={singleData?.deviceInfo?.deviceType}
    //           />
    //           <InfoRow
    //             icon={<MdSecurity color="#d35400" />}
    //             label="Plan"
    //             value={singleData?.deviceInfo?.plan}
    //           />
    //           <InfoRow
    //             icon={<MdDateRange color="#2980b9" />}
    //             label="Total Months"
    //             value={`${singleData?.deviceInfo?.totalMonths} Months`}
    //           />
    //           <InfoRow
    //             icon={<MdSecurity color="#8e44ad" />}
    //             label="Price"
    //             value={`₹${singleData?.deviceInfo?.customPrice}`}
    //           />
    //         </FlexboxGrid>
    //       </Panel>

    //       {/* Activation Info */}
    //       <Panel bordered shaded header="🔧 Activation Info" style={{ marginBottom: 10 ,  background: '#ffffff'}}>
    //         <FlexboxGrid>
    //           <InfoRow
    //             icon={<MdCheckCircle color="#27ae60" />}
    //             label="Status"
    //             value={
    //               <Tag color={singleData?.status === 'active' ? 'green' : 'orange'}>
    //                 {singleData?.status}
    //               </Tag>
    //             }
    //           />
    //           <InfoRow
    //             icon={<MdOutlineAppSettingsAlt color="#1abc9c" />}
    //             label="Application"
    //             value={singleData?.applicationName}
    //           />
    //           <InfoRow
    //             icon={<MdDateRange color="#34495e" />}
    //             label="Activated On"
    //             value={new Date(singleData?.lastActivatedAt).toLocaleString()}
    //           />
    //           <InfoRow
    //             icon={<MdAccessTime color="#e67e22" />}
    //             label="Expires On"
    //             value={new Date(singleData?.expirationDate).toLocaleString()}
    //           />
    //           <InfoRow
    //             icon={<MdWifi color="#f39c12" />}
    //             label="MAC Address"
    //             value={singleData?.macAddress}
    //           />
    //           <InfoRow
    //             icon={<MdOutlineLink color="#9b59b6" />}
    //             label="URL"
    //             value={
    //               <a href={`https://${singleData?.url}`} target="_blank" rel="noreferrer">
    //                 {singleData?.url}
    //               </a>
    //             }
    //           />
    //           <InfoRow
    //             icon={<MdAccountBox color="#2980b9" />}
    //             label="Username"
    //             value={singleData?.username}
    //           />
    //           <InfoRow
    //             icon={<MdSecurity color="#c0392b" />}
    //             label="Password"
    //             value={singleData?.password}
    //           />
    //         </FlexboxGrid>
    //       </Panel>

    //       {/* Employee Info */}
    //       <Panel bordered shaded header="👤 Assigned Employee" style={{ marginBottom: 10,  background: '#ffffff' }}>
    //         <FlexboxGrid>
    //           <InfoRow
    //             icon={<MdPerson color="#3498db" />}
    //             label="Name"
    //             value={singleData?.assignedEmployee?.name}
    //           />
    //           <InfoRow
    //             icon={<MdEmail color="#9b59b6" />}
    //             label="Email"
    //             value={singleData?.assignedEmployee?.email}
    //           />
    //         </FlexboxGrid>
    //       </Panel>

    //       {/* Duration Picker */}
    //       <Panel bordered shaded header="📅 Set New Duration (Months)" style={{ background: '#ffffff' }}>
    //         <SelectPicker
    //           data={monthOptions}
    //           searchable={false}
    //           style={{ width: '100%' }}
    //           placeholder="Select duration"
    //           defaultValue={singleData?.currentMonth}
    //           placement="top"
    //         />
    //       </Panel>
    //     </div>
    //   </Modal.Body>

    //   <Modal.Footer>
    //     <Button onClick={() => setOpenDetails(false)} appearance="primary">
    //       Close
    //     </Button>
    //   </Modal.Footer>
    // </Modal>
  )
}

export default SaleDetailsModal
