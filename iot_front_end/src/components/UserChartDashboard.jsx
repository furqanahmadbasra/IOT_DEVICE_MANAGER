


import React, { useContext, useRef, useEffect } from 'react';
import { DeviceDataContext } from './DeviceDataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './UserChartDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const UserChartDashboard = () => {
  const { deviceData, loading, error } = useContext(DeviceDataContext);
  const barRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      barRef.current?.resize();
      pieRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <p>Loading device data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!deviceData || deviceData.length === 0) return <p>No device data available.</p>;

  const batteryLabels = deviceData.map((d) => `Device ${d.deviceId}`);
  const batteryData = deviceData.map((d) => d.batteryStatus);

  const batteryChartData = {
    labels: batteryLabels,
    datasets: [
      {
        label: 'Battery Level (%)',
        data: batteryData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const batteryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Battery Levels of Devices' },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  // Lock status pie chart
  const lockedCount = deviceData.filter((d) => d.locked).length;
  const unlockedCount = deviceData.length - lockedCount;

  const lockStatusData = {
    labels: ['Locked', 'Unlocked'],
    datasets: [
      {
        label: 'Lock Status',
        data: [lockedCount, unlockedCount],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverOffset: 30,
      },
    ],
  };

  const lockStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Lock Status Distribution' },
    },
  };

  return (
    <div className="chart-dashboard-container">
      <h1>User Device Charts</h1>

      <section className="chart-section">
        <div className="chart-wrapper">
          <Bar ref={barRef} data={batteryChartData} options={batteryChartOptions} />
        </div>
      </section>

      <section className="chart-section">
        <div className="chart-wrapper">
          <Pie ref={pieRef} data={lockStatusData} options={lockStatusOptions} />
        </div>
      </section>
    </div>
  );
};

export default UserChartDashboard;
