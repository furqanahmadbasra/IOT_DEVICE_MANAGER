
import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
const [devices, setDevices] = useState([]);
const [searchTerm, setSearchTerm] = useState('');

const filteredDevices = devices.filter(device =>
    device.deviceId.toLowerCase().includes(searchTerm.toLowerCase())
);


    const [doorData, setDoorData] = useState({
        deviceId: '',
        locked: true,
        lastAccessedBy: '',
        batteryStatus: 100,
        status: 'online'
    });

    const [submitStatus, setSubmitStatus] = useState({ loading: false, success: false, error: null });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchDevices = async () => {
        try {
            const response = await fetch('https://iot-device-manager.vercel.app/api/admin/get_all_iot_data');
            const data = await response.json();
            setDevices(data);
        } catch (err) {
            console.error('Error fetching devices:', err);
        }
    };
    useEffect(() => {
        fetchDevices();
    }, []);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDoorData({ ...doorData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitStatus({ loading: true, success: false, error: null });
            const response = await fetch(`https://iot-device-manager.vercel.app/api/admin/submit_iot_data/${doorData.deviceId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doorData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save door data');
            }



            setDoorData({ deviceId: '', locked: true, lastAccessedBy: '', batteryStatus: 100, status: 'online' });
            setSubmitStatus({ loading: false, success: true, error: null });
            await fetchDevices(); // <-- Add this
            setTimeout(() => setSubmitStatus(prev => ({ ...prev, success: false })), 3000);
        } catch (error) {
            setSubmitStatus({ loading: false, success: false, error: error.message });
        }
    };

    const handleEditClick = (device) => {
        setEditData(device);
        setEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData({ ...editData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleUpdateSubmit = async () => {
        try {
            const response = await fetch(`https://iot-device-manager.vercel.app/api/admin/update_iot_data/${editData.deviceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            if (!response.ok) throw new Error('Failed to update device');
            const updated = await response.json();
            setDevices(devices.map(d => d.deviceId === updated.deviceId ? updated : d));
            setEditModalOpen(false);
            await fetchDevices(); // <-- Add this
        } catch (err) {
            alert('Update failed: ' + err.message);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Smart Door Management</h1>
                <p>Add and manage IoT smart door devices</p>
            </div>

            <div className="admin-content">
                {/* Left Panel */}
                <div className="door-form-container">
                    <h2>Add New Smart Door Data</h2>
                    <form onSubmit={handleSubmit} className="door-form">
                        <div className="form-group">
                            <label htmlFor="deviceId">Device ID *</label>
                            <input
                                type="text"
                                id="deviceId"
                                name="deviceId"
                                value={doorData.deviceId}
                                onChange={handleChange}
                                required
                                placeholder="e.g. DOOR-001"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="locked"
                                    checked={doorData.locked}
                                    onChange={handleChange}
                                />
                                Door Locked
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastAccessedBy">Last Accessed By</label>
                            <input
                                type="text"
                                id="lastAccessedBy"
                                name="lastAccessedBy"
                                value={doorData.lastAccessedBy}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                            />
                            <small>Leave blank to use "Unknown"</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="batteryStatus">Battery Status (%) *</label>
                            <div className="range-input-group">
                                <input
                                    type="range"
                                    id="batteryStatus"
                                    name="batteryStatus"
                                    min="0"
                                    max="100"
                                    value={doorData.batteryStatus}
                                    onChange={handleChange}
                                />
                                <span className="range-value">{doorData.batteryStatus}%</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Connection Status *</label>
                            <select
                                id="status"
                                name="status"
                                value={doorData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>

                        <div className="form-footer">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={submitStatus.loading}
                            >
                                {submitStatus.loading ? "Saving..." : "Save Door Data"}
                            </button>

                            {submitStatus.success && (
                                <div className="success-message">
                                    <span>✓</span> Door data saved successfully!
                                </div>
                            )}

                            {submitStatus.error && (
                                <div className="error-message">
                                    <span>✗</span> Error: {submitStatus.error}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Panel */}
                <div className="door-info-panel">
                    <h2>All Smart Doors</h2>

                    <input
                        type="text"
                        placeholder="Search devices by ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <div className="device-card-list">
                        {filteredDevices.map(device => (
                            <div key={device.deviceId} className="info-card">
                                <h3>{device.deviceId}</h3>
                                <p><strong>Locked:</strong> {device.locked ? 'Yes' : 'No'}</p>
                                <p><strong>Last Accessed:</strong> {device.lastAccessedBy || 'Unknown'}</p>
                                <p><strong>Battery:</strong> {device.batteryStatus}%</p>
                                <p><strong>Status:</strong> {device.status}</p>
                                <button onClick={() => handleEditClick(device)} className="update-btn">Update</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            {editModalOpen && editData && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Update Device - {editData.deviceId}</h2>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="locked"
                                    checked={editData.locked}
                                    onChange={handleEditChange}
                                />
                                Door Locked
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastAccessedBy">Last Accessed By</label>
                            <input
                                type="text"
                                name="lastAccessedBy"
                                value={editData.lastAccessedBy || ''}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="batteryStatus">Battery Status (%)</label>
                            <div className="range-input-group">
                                <input
                                    type="range"
                                    name="batteryStatus"
                                    min="0"
                                    max="100"
                                    value={editData.batteryStatus}
                                    onChange={handleEditChange}
                                />
                                <span className="range-value">{editData.batteryStatus}%</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Connection Status</label>
                            <select
                                name="status"
                                value={editData.status}
                                onChange={handleEditChange}
                            >
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button onClick={handleUpdateSubmit} className="submit-btn">Save Update</button>
                            <button onClick={() => setEditModalOpen(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
