import React from 'react'
import { Modal, Panel, Tag, Button } from 'rsuite'
import LottiePlayer from './LottiePlayer'
import CallbackTimer from './CallbackTimer'

import {
  FaUser,
  FaAddressCard,
  FaPhone,
  FaEnvelope,
  FaUserPlus,
  FaLink,
  FaCogs,
  FaCalendarAlt,
  FaUserFriends,
} from 'react-icons/fa'

const CallbackDetailModal = ({customerDetails, setOpenModal, openModal}) => {
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="lg">
      <Modal.Header>
        <Modal.Title className="text-lg font-semibold">🎯 Customer Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Basic Info */}
          <Panel bordered header="🧾 Basic Info" shaded className="rounded-2xl shadow-sm">
            <p>
              <FaUser className="inline mr-2" /> <b>Name:</b> {customerDetails?.name}
            </p>
            <p>
              <FaEnvelope className="inline mr-2" /> <b>Email:</b> {customerDetails?.email}
            </p>
            <p>
              <FaPhone className="inline mr-2" /> <b>Phone:</b> {customerDetails?.phone}
            </p>
            <p>
              <FaAddressCard className="inline mr-2" /> <b>Address:</b> {customerDetails?.address}
            </p>
            <p>
              <b>Status:</b> <Tag color="blue">{customerDetails?.status}</Tag>
            </p>
          </Panel>

          {/* Notes */}
          <Panel bordered header="📝 Note" shaded className="rounded-2xl shadow-sm">
            {customerDetails?.notes ? (
              <>
                <p>
                 <Button appearance='ghost'>View Notes</Button>
                </p>
              </>
            ) : (
              <p>Nothing information form customer</p>
            )}
          </Panel>

          {/* Tima & Date */}
          <Panel bordered header="⏰ Time & Date" shaded className="rounded-2xl shadow-sm">
            {customerDetails?.scheduledTime ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ color: '#0070f3', fontWeight: '700', fontSize: '18px' }}>
                  📞 <span style={{ color: '#696969' }}>Callback Time:</span>{' '}
                  {new Date(customerDetails.scheduledTime).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    height: 'min-content',
                  }}
                >
                  <LottiePlayer></LottiePlayer>
                  <CallbackTimer scheduledTime={customerDetails.scheduledTime} />
                </div>
              </div>
            ) : (
              <p>Not Scheduled</p>
            )}
          </Panel>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => setOpenModal(false)} appearance="primary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CallbackDetailModal
