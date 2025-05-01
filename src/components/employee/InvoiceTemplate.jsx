import React, { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import logo from '../../assets/assets/images/logos/logo-invoice.jpg'

const InvoiceTemplate = ({ rowData }) => {
  const {
    invoiceNumber,
    createdAt,
    status,
    customer,
    service,
    saleItems,
    totalAmount,
    paymentMethod,
  } = rowData

  const invoiceRef = useRef()

  const handleDownload = async () => {
    const element = invoiceRef.current
    if (!element) return

    element.style.background = '#fff'

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    })

    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${customer.name}-Invoice.pdf`)
  }

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <div className="download-btn">
        <button onClick={handleDownload}>Download Invoice</button>
      </div>

      <div ref={invoiceRef} className="invoice-container">
        <div className="invoice-header">
          <img src={logo} alt="Company Logo" className="invoice-logo" />
          <div style={{ textAlign: 'right' }}>
            <h2>Invoice</h2>
            <p>#{invoiceNumber}</p>
            <p>{new Date(createdAt).toLocaleDateString()}</p>
            <span
              className="invoice-status"
              style={{ backgroundColor: `${status === 'completed' ? '#52C41A' : '#FA8C16'}` }}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="info-section">
          <div className="info-box">
            <h4>Customer Info</h4>
            <p>
              <strong>Name:</strong> {customer.name}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>
          </div>
          <div className="info-box">
            <h4>Payment Info</h4>
            <p>
              <strong>Method:</strong> {paymentMethod}
            </p>
            <p>
              <strong>Service ID:</strong> {service}
            </p>
            <p>
              <strong>Total:</strong> ${totalAmount}
            </p>
          </div>
        </div>

        <h4>Sale Details</h4>
        <table>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {saleItems.map((item, index) => (
              <tr key={index}>
                <td>{item.plan}</td>
                <td>{item.qty}</td>
                <td>${item.amount}</td>
                <td>
                  <span className={`tag ${item.status === 'paid' ? 'paid' : ''}`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-box">Total: ${totalAmount}</div>
      </div>
    </div>
  )
}

export default InvoiceTemplate
