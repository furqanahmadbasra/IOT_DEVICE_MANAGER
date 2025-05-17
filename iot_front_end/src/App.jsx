import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import UserChartDashboard from './components/UserChartDashboard';
import { DeviceDataProvider } from './components/DeviceDataContext'; // import your context provider

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route
            path="/user"
            element={
              <DeviceDataProvider>
                <UserDashboard />
              </DeviceDataProvider>
            }
          />
          <Route
            path="/"
            element={
              <DeviceDataProvider>
                <UserDashboard />
              </DeviceDataProvider>
            }
          />
          <Route
            path="/user_chart"
            element={
              <DeviceDataProvider>
                <UserChartDashboard />
              </DeviceDataProvider>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
