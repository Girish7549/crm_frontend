import React from 'react'
import './style.css'

const NotesTimeline = ({ rowData }) => {
 console.log('Drawer data :', rowData)
  return (
    <div className="timeline-container">
      {rowData?.notes.map((note, index) => (
        <div
          className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
          key={note._id || index}
        >
          <div className={`timeline-content ${index % 2 === 0 ? 'alt-1' : 'alt-2'}`} style={{}}>
            {
              note.employee && (<h3>{note.employee?.name}</h3>)
            }
            
            <p className="note-date" style={{fontSize:'12px'}}>
              {new Date(note.createdAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
            <p style={{}}>{note.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotesTimeline
