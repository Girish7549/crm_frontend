import React from 'react'
import { Drawer, ButtonToolbar, Button, Placeholder } from 'rsuite'
import InvoiceTemplate from './InvoiceTemplate'

const InvoiceDrawer = ({ openInvoiceDrawer, setOpenInvoiceDrawer, rowData }) => {
    console.log("Row data inside drawer :", rowData)
  return (
    <Drawer open={openInvoiceDrawer} onClose={() => setOpenInvoiceDrawer(false)}>
      <Drawer.Header>
        <Drawer.Title>Invoice 📑</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <InvoiceTemplate rowData={rowData} />
      </Drawer.Body>
    </Drawer>
  )
}

export default InvoiceDrawer
