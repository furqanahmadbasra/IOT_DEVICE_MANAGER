


// UserDashboard.jsx
import React, { useContext } from 'react';
import { DeviceDataContext } from './DeviceDataContext.jsx';
import { Battery, Lock, Unlock, User, Clock, Wifi, WifiOff } from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
    const { deviceData, loading, error } = useContext(DeviceDataContext);

    if (loading) return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="spinner"></div>
                <p className="loading-text">Loading latest device data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error-box">
                <div className="error-icon-container">
                    <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="error-title">Error Occurred</h3>
                <p className="error-message">{error}</p>
            </div>
        </div>
    );

    if (!deviceData || deviceData.length === 0) return (
        <div className="no-data-container">
            <div className="no-data-box">
                <div className="no-data-icon-container">
                    <svg className="no-data-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="no-data-title">No Data Available</h3>
                <p className="no-data-message">No device data has been found. Please check your connection or try again later.</p>
            </div>
        </div>
    );

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
        }).format(date);
    };

    const getBatteryColor = (percentage) => {
        if (percentage > 60) return 'green';
        if (percentage > 20) return 'yellow';
        return 'red';
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Smart Lock Dashboard</h1>
                        <p className="dashboard-subtitle">Monitor and manage your connected door locks</p>
                    </div>
                    <div className="device-count">
                        {deviceData.length} Device{deviceData.length !== 1 ? 's' : ''} Connected
                    </div>
                </div>

                <div className="device-grid">
                    {deviceData.map((door) => (
                        <div key={door._id} className="device-card">
                            <div className="device-card-header">
                                <h3 className="device-id">Device {door.deviceId}</h3>
                                <div className={`device-status ${door.status === 'online' ? 'online' : 'offline'}`}>
                                    {door.status === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
                                    <span>{door.status.charAt(0).toUpperCase() + door.status.slice(1)}</span>
                                </div>
                            </div>

                            <div className="device-card-body">
                                {/* Lock Status */}
                                <div className="info-block">
                                    <div className={`status-icon ${door.locked ? 'locked' : 'unlocked'}`}>
                                        {door.locked ? <Lock size={22} /> : <Unlock size={22} />}
                                    </div>
                                    <div>
                                        <p className="info-label">Lock Status</p>
                                        <p className={`info-value ${door.locked ? 'locked' : 'unlocked'}`}>
                                            {door.locked ? 'Locked' : 'Unlocked'}
                                        </p>
                                    </div>
                                </div>

                                {/* Battery Status */}
                                <div className="info-block">
                                    <div className="status-icon battery">
                                        <Battery size={22} />
                                    </div>
                                    <div className="battery-bar-container" style={{ width: '100%' }}>
                                        <div className="info-label-group">
                                            <p className="info-label">Battery Status</p>
                                            <p className="info-value">{door.batteryStatus}%</p>
                                        </div>
                                        <div className="battery-bar">
                                            <div
                                                className={`battery-fill ${getBatteryColor(door.batteryStatus)}`}
                                                style={{ width: `${door.batteryStatus}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Last Accessed By */}
                                <div className="info-block">
                                    <div className="status-icon user">
                                        <User size={22} />
                                    </div>
                                    <div>
                                        <p className="info-label">Last Accessed By</p>
                                        <p className="info-value">{door.lastAccessedBy || 'Unknown'}</p>
                                    </div>
                                </div>

                                {/* Last Access Time */}
                                <div className="info-block">
                                    <div className="status-icon time">
                                        <Clock size={22} />
                                    </div>
                                    <div>
                                        <p className="info-label">Last Access Time</p>
                                        <p className="info-value">{formatDateTime(door.accessTime)}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;