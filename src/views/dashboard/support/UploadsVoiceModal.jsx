import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Modal, Loader } from 'rsuite';
import { baseUrl } from '../../../API/Api';

const UploadsVoiceModal = ({ open, handleClose, data, getAllEmpSale }) => {
    const update_sale = `${baseUrl}/sale`;
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        if (files.length > 1) {
            toast.warning('Please select only one voice note file.');
            return;
        }

        setSelectedFiles(files); // Accept only one file
    };

    const handleRemoveVoice = () => {
        setSelectedFiles([]);
    };

    async function updateHandler() {
        try {
            setLoading(true);

            if (selectedFiles.length === 0) {
                toast.warning('Please select a voice note before submitting.');
                setLoading(false);
                return;
            }

            const uploadData = new FormData();
            uploadData.append('voiceProof', selectedFiles[0]); // Only one file

            const response = await fetch(`${update_sale}/${data._id}`, {
                method: 'PUT',
                body: uploadData,
            });

            if (!response.ok) {
                throw new Error('Failed to update voice note');
            }

            getAllEmpSale();
            toast.success('Voice note uploaded successfully');
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error('Upload failed');
        } finally {
            setLoading(false);
            
            setSelectedFiles([]);
        }
    }

    return (
        <Modal size="sm" open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Upload Voice Note</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <input
                    type="file"
                    required
                    accept="audio/*"
                    onChange={handleFileChange}
                    style={{ marginBottom: '10px' }}
                />

                {selectedFiles.length > 0 && (
                    <div
                        style={{
                            position: 'relative',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            padding: '10px',
                            background: '#f9f9f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <audio
                            controls
                            src={URL.createObjectURL(selectedFiles[0])}
                            style={{ width: '100%', marginRight: '10px' }}
                        />
                        <button
                            onClick={handleRemoveVoice}
                            style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                background: 'transparent',
                                border: 'none',
                                color: '#f00',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                            title="Remove"
                        >
                            ×
                        </button>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={handleClose} appearance="subtle">
                    Cancel
                </Button>
                <Button onClick={updateHandler} appearance="primary" loading={loading}>
                    {loading ? <Loader size="xs" /> : 'Submit'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UploadsVoiceModal;
