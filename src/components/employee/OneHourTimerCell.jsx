import { useEffect, useState } from 'react'
import { Cell } from 'rsuite-table'

const OneHourTimerCell = ({ rowData, dataKey, ...props }) => {
  const startTime = new Date(rowData[dataKey])
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // +1 hour

  const [remaining, setRemaining] = useState(getTimeLeft(endTime))

  function getTimeLeft(target) {
    const now = new Date()
    const diff = target - now

    if (diff <= 0) return '⛔ Time Up'

    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)

    return `${minutes}m ${seconds}s`
  }

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRemaining(getTimeLeft(endTime))
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [rowData[dataKey]]) // Recalculate if the base time changes

  return (
    <Cell
      {...props}
      style={{ color: remaining === '⛔ Time Up' ? 'red' : '#155724', padding: '4px 10px' }}
    >
      {remaining}
    </Cell>
  )
}

export default OneHourTimerCell
