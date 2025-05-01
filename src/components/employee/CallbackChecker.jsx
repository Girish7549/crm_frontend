import { useEffect, useRef, useState } from 'react'
import { Modal, Button } from 'rsuite'
import { baseUrl } from '../../API/Api'

const CallbackChecker = ({ callbacks }) => {
  const userID = JSON.parse(localStorage.getItem('user'))

  // console.log("User ID :", userID)

  const alertedSet = useRef(new Set())
  const [showModal, setShowModal] = useState(false)
  const [alertData, setAlertData] = useState(null)

  const postNotification = async (callback) => {
    try {
      await fetch(`${baseUrl}/notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${callback.name}`,
          callback: callback._id,
          employee: userID.id,
        }),
      })
    } catch (err) {
      console.error('Error posting notification:', err)
    }
  }

  const checkUpcomingCallbacks = (callbacks) => {
    const now = new Date()

    callbacks?.forEach((callback) => {
      const scheduledTime = new Date(callback.scheduledTime)
      const diffInMs = scheduledTime - now
      const diffInMinutes = diffInMs / 1000 / 60

      if (diffInMinutes <= 5 && diffInMinutes >= 0 && !alertedSet.current.has(callback._id)) {
        setAlertData({
          name: callback.name,
          minutes: Math.round(diffInMinutes),
        })
        setShowModal(true)
        alertedSet.current.add(callback._id)

        // Save to localStorage to persist on reload
        const updatedSet = new Set([...alertedSet.current])
        localStorage.setItem('alertedCallbacks', JSON.stringify(Array.from(updatedSet)))

        postNotification(callback)
      }
    })
  }

  useEffect(() => {
    const savedAlerted = JSON.parse(localStorage.getItem('alertedCallbacks')) || []
    alertedSet.current = new Set(savedAlerted)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      checkUpcomingCallbacks(callbacks)
    }, 60000)

    checkUpcomingCallbacks(callbacks)

    return () => clearInterval(interval)
  }, [callbacks])

  return (
    <>
      <Modal open={showModal} onClose={() => setShowModal(false)} size="xs">
        <Modal.Header>
          <Modal.Title>⏰ Callback Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertData ? (
            <p>
              You have an upcoming callback with <b>{alertData.name}</b> in{' '}
              <b>{alertData.minutes} minute(s)</b>.
            </p>
          ) : (
            <p>No upcoming callbacks.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setShowModal(false)
              window.location.reload()
            }}
            appearance="primary"
          >
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CallbackChecker
