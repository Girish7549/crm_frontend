import React, { useState } from 'react';
import { Button, Modal, SelectPicker } from 'rsuite';
import axios from 'axios';
import { baseUrl } from "../../../API/Api";
import { toast } from 'react-toastify';

const CreateTrialActivationsModal = ({ open, handleClose, data, getAllEmpActivations }) => {
    const userID = JSON.parse(localStorage.getItem('user'));

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        trial: '',
        team: userID.teamId,
        assignedEmployee: userID.id,
        applicationName: '',
        note: ''
    });


    const [selectedEmail, setSelectedEmail] = useState('');

    const handleCustomerChange = (value) => {
        const selected = data.find((item) => item._id === value);
        if (selected) {
            setFormData({
                trial: selected._id, // Use trial ID
                team: userID.teamId,
                assignedEmployee: userID.id,
                applicationName: '',
                note: ''
            });
            setSelectedEmail(selected.email || '');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const { trial, team, assignedEmployee, applicationName, note } = formData;

        if (!trial || !applicationName.trim() || !note.trim()) {
            toast.warning("Please fill all required fields.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                trial,
                team,
                assignedEmployee,
                applicationName,
                notes: [
                    {
                        note,
                        employee: userID.id
                    }
                ]
            };

            await axios.post(`${baseUrl}/trialActivations`, payload);
            toast.success("Trial Activation created successfully!");
            handleClose();
            getAllEmpActivations();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create trial activation.");
        } finally {
            setLoading(false);
            setFormData({
                trial: '',
                team: userID.teamId,
                assignedEmployee: userID.id,
                applicationName: '',
                note: ''
            });
            setSelectedEmail('');
        }
    };

    return (
        <Modal size="sm" open={open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>Create Trial Activation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Customer Picker */}
                    <div>
                        <label style={{ fontWeight: '600' }}>Select Customer</label>
                        <SelectPicker
                            data={data?.map((item) => ({
                                label: item.name,
                                value: item._id
                            }))}
                            style={{ width: '100%', marginTop: 8 }}
                            onChange={handleCustomerChange}
                            placeholder="Choose a customer"
                        />
                        {selectedEmail && (
                            <p style={{ color: 'purple', fontSize: '13px', marginTop: 5 }}>
                                {selectedEmail}
                            </p>
                        )}
                    </div>

                    {/* Application Name */}
                    <div>
                        <label style={{ fontWeight: 500 }}>Application Name<span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="applicationName"
                            value={formData.applicationName}
                            onChange={handleChange}
                            required
                            placeholder="Enter application name"
                            style={{
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                width: '100%',
                                marginTop: 6
                            }}
                        />
                    </div>

                    {/* Note Field */}
                    <div>
                        <label style={{ fontWeight: 500 }}>Note<span className="text-danger">*</span></label>
                        <textarea
                            rows="3"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            required
                            placeholder="Add a note..."
                            style={{
                                padding: '10px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                width: '100%',
                                marginTop: 6,
                                resize: 'none'
                            }}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} appearance="subtle">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} appearance="primary" loading={loading}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateTrialActivationsModal;
