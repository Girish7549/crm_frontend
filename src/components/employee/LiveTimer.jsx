import { useEffect, useState } from 'react'
import { Cell } from 'rsuite-table'

const LiveTimerCell = ({ rowData, dataKey, ...props }) => {
  const targetTime = new Date(rowData[dataKey])
  const [remaining, setRemaining] = useState(getTimeLeft(targetTime))

  function getTimeLeft(target) {
    const now = new Date()
    const diff = target - now

    if (diff <= 0) return '⛔ Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getTimeLeft(targetTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetTime])

  return (
    <Cell
      {...props}
      style={{ color: remaining === '⛔ Expired' ? 'green' : '#0c5460', padding: '4px 10px' }}
    >
      {/* {remaining} */}
      {rowData.status === 'pending'
        ? 'Wating...'
        : rowData.status === 'cancelled'
          ? 'Rejected'
          : rowData.status === 'done'
            ? 'Completed'
            : rowData.status === 'active'
              ? 'Active'
              : remaining}
    </Cell>
  )
}

export default LiveTimerCell
