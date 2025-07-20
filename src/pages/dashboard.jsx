import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './dashboard.css';

// Set up Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API_BASE = 'https://mitr-api.onrender.com';
const API_KEY = 'mitrSos@2025';
const DEVICE_ID = 'device_1';

const Dashboard = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const [user, setUser] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState({
    name: 'MITR Device',
    id: DEVICE_ID,
    status: 'Inactive'
  });
  const [emergencyContacts] = useState([
    { name: 'Emergency Contact 1', phone: '+91 (9311953757)', relationship: 'Family' },
    { name: 'Emergency Contact 2', phone: '+91 (9310082225)', relationship: 'Friend' }
  ]);
  const [triggerWords] = useState(['Help me', 'Emergency', 'SOS']);

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('mitr-user'));
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }
    setUser(storedUser);
  }, []);

  // Fetch coordinates from backend
  const fetchCoordinates = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/device/data/${DEVICE_ID}`, {
        headers: { 'x-api-key': API_KEY },
      });

      if (res.status === 403) {
        setIsTriggered(false);
        setCoordinates([]);
        setDeviceInfo(prev => ({ ...prev, status: 'Inactive' }));
        return;
      }

      const data = await res.json();
      setCoordinates(data.coordinates || []);
      setLastUpdate(new Date());
      setIsTriggered(true);
      setDeviceInfo(prev => ({ ...prev, status: 'Active' }));
      setError(null);
    } catch (err) {
      setError('Failed to fetch coordinates');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop trigger
  const stopTrigger = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/device/trigger/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ deviceId: DEVICE_ID }),
      });

      if (res.ok) {
        setIsTriggered(false);
        setCoordinates([]);
        setLastUpdate(null);
        setDeviceInfo(prev => ({ ...prev, status: 'Inactive' }));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to stop trigger');
      }
    } catch (err) {
      alert('Error stopping trigger');
      console.error(err);
    }
  };

  // Check if device is triggered
  const checkTriggerStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/device/status/${DEVICE_ID}`, {
        headers: { 'x-api-key': API_KEY },
      });

      const data = await res.json();
      setIsTriggered(data.triggered || false);
      setDeviceInfo(prev => ({
        ...prev,
        status: data.triggered ? 'Active' : 'Inactive'
      }));
      
      if (data.triggered) {
        fetchCoordinates();
      }
    } catch (err) {
      console.error('Status check failed:', err);
    }
  };

  useEffect(() => {
    checkTriggerStatus();
  }, []);

  useEffect(() => {
    if (isTriggered) {
      const intervalId = setInterval(fetchCoordinates, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isTriggered]);

  const calculateCenter = () => {
    if (coordinates.length === 0) return [0, 0];
    const sum = coordinates.reduce(
      (acc, coord) => ({
        lat: acc.lat + coord.latitude,
        lng: acc.lng + coord.longitude,
      }),
      { lat: 0, lng: 0 }
    );
    return [sum.lat / coordinates.length, sum.lng / coordinates.length];
  };

  const formatTime = (timestamp) => new Date(timestamp).toLocaleString();

  if (!user) return <div className="dashboard-loading">Loading user data...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user.name}</h1>

      {/* Top Row - Info Cards */}
      <div className="dashboard-top-row">
        {/* User Profile Card */}
        <div className="dashboard-card profile-card">
          <div className="card-body">
            <h5>User Profile</h5>
            <div className="profile-info">
              <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-details">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Device Info Card */}
        <div className="dashboard-card device-card">
          <div className="card-body">
            <h5>Device Information</h5>
            <div className="device-info">
              <p><strong>Device Name:</strong> {deviceInfo.name}</p>
              <p><strong>Device ID:</strong> {deviceInfo.id}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`status-indicator ${deviceInfo.status.toLowerCase()}`}>
                  {deviceInfo.status}
                </span>
              </p>
              {isTriggered && (
                <button 
                  onClick={stopTrigger}
                  className="stop-trigger-btn"
                >
                  Stop Triggering
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contacts Card */}
        <div className="dashboard-card contacts-card">
          <div className="card-body">
            <h5>Emergency Contacts</h5>
            <div className="contacts-list">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="contact-item">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-phone">{contact.phone}</div>
                  {contact.relationship && (
                    <div className="contact-relationship">{contact.relationship}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="trigger-words">
              <h6>Trigger Words:</h6>
              <div className="trigger-words-container">
                {triggerWords.map((word, index) => (
                  <span key={index} className="trigger-word-badge">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="dashboard-card map-card">
        <div className="card-body">
          <h5>Live Location Tracking</h5>
          <div className="map-container">
            <MapContainer
              center={calculateCenter()}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {coordinates.map((coord) => (
                <Marker
                  key={`${coord.deviceId}-${coord.timestamp}`}
                  position={[coord.latitude, coord.longitude]}
                >
                  <Popup>
                    <strong>Device ID:</strong> {coord.deviceId}<br />
                    <strong>Coordinates:</strong> {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}<br />
                    <strong>Time:</strong> {formatTime(coord.timestamp)}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Coordinates History Card */}
      <div className="dashboard-card history-card">
        <div className="card-body">
          <h5>Location History</h5>
          {error && <div className="error-message">{error}</div>}
          
          {isLoading ? (
            <div className="loading">Loading GPS data...</div>
          ) : coordinates.length > 0 ? (
            <div className="coordinates-table">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {coordinates.map((coord, index) => (
                    <tr key={index}>
                      <td>{formatTime(coord.timestamp)}</td>
                      <td>{coord.latitude.toFixed(6)}</td>
                      <td>{coord.longitude.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No location data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;