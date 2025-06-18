import React, { createContext, useState, useEffect } from 'react';

export const DeviceDataContext = createContext();

export const DeviceDataProvider = ({ children }) => {
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestData = async () => {

    try {
      const response = await fetch('http://localhost:5000/api/user/get_iot_data');
      if (!response.ok) throw new Error('Network response not ok');
      const result = await response.json();
      setDeviceData(result.data);  
      setError(null);
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestData();
    const interval = setInterval(fetchLatestData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DeviceDataContext.Provider value={{ deviceData, loading, error }}>
      {children}
    </DeviceDataContext.Provider>
  );
};
