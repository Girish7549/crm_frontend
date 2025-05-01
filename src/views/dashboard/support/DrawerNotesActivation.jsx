import React, { useState } from 'react'
import { Modal, Button, Input, Message, useToaster, Loader, Drawer } from 'rsuite'
import NotesTimeline from './NotesTimeline'
import { baseUrl } from '../../../API/Api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DrawerNotesActivation = ({
    rowData,
    calback = true,
    openWithHeader,
    setOpenWithHeader,
    getAllEmpActivations,
    path
}) => {
    const userID = JSON.parse(localStorage.getItem('user'))
    const update_activation_Note = `${baseUrl}/${path}/${rowData?._id}`
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [notesData, setNotesData] = useState({
        note: '',
        employee: userID?.id,
    })

    const handleSubmit = async () => {
        if (!notesData.note.trim()) {
            toast.warning('Note cannot be empty.');
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await fetch(update_activation_Note, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    notes: [
                        {
                            note: notesData.note,
                            employee: userID.id, // Make sure this is correct
                        },
                        
                    ],
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update note.');
            }
    
            toast.success('Note updated successfully!');
            setOpen(false);
            setOpenWithHeader(false);
            getAllEmpActivations();
        } catch (error) {
            console.error('Error updating note:', error);
            toast.error('Something went wrong while updating the note.');
        } finally {
            setLoading(false);
            setNotesData({ note: '', employee: userID.id });
        }
    };
    

    return (
        <Drawer
            open={openWithHeader}
            onClose={() => setOpenWithHeader(false)}
            flexDirection={'column'}
            style={{ padding: '0px' }}
        >
            <Drawer.Header>
                <Drawer.Title>{calback ? 'Callback Notes' : 'Activation Notes'}</Drawer.Title>
                {!calback && (
                    <Button appearance="ghost" onClick={() => setOpen(true)}>
                        + Notes
                    </Button>
                )}
            </Drawer.Header>
            <Drawer.Body style={{ padding: '0px' }}>
                <NotesTimeline rowData={rowData} />
            </Drawer.Body>
            <Modal open={open} onClose={() => setOpen(false)} size="sm" className="rounded-xl">
                <Modal.Header>
                    <Modal.Title>📝 Add New Note</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Input
                        as="textarea"
                        rows={5}
                        placeholder="Write your note about the activation & customer..."
                        value={notesData.note}
                        onChange={(value) => setNotesData((prevData) => ({ ...prevData, note: value }))}
                        style={{
                            borderRadius: 10,
                            padding: '10px',
                            fontSize: '1rem',
                            border: '1px solid #ddd',
                        }}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={handleSubmit} appearance="primary" color="green" loading={loading}>
                        {loading ? <Loader size="xs" /> : 'Submit Note'}
                    </Button>
                    <Button onClick={() => setOpen(false)} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </Drawer>
    )
}

export default DrawerNotesActivation;
