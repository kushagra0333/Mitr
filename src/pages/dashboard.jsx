import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiMap, FiClock, FiUsers, FiSettings, 
  FiAlertCircle, FiSmartphone, FiNavigation, 
  FiBell, FiUser, FiX, FiPlus, FiStopCircle,
  FiBattery, FiWifi, FiCalendar, FiDownload,
  FiEdit, FiTrash2, FiPhone, FiMessageSquare,
  FiChevronDown, FiPower, FiLock, FiShield
} from 'react-icons/fi';
import { 
  IoMdAlert, IoMdNotificationsOutline, 
  IoMdPerson, IoMdSettings, IoMdTime 
} from 'react-icons/io';
import { 
  MdEmergency, MdLocationOn, MdCall, 
  MdMessage, MdBatteryFull, MdNetworkWifi 
} from 'react-icons/md';
import { RiShieldUserLine, RiSignalWifiLine } from 'react-icons/ri';
import { BsBatteryHalf, BsLightningFill } from 'react-icons/bs';
import "./dashboard.css";
// Custom marker icon
const createMitrIcon = (color = '#8b5cf6') => {
  return new L.DivIcon({
    html: `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="${color}" fill-opacity="0.2"/>
        <circle cx="16" cy="16" r="8" fill="${color}"/>
        <path d="M16 8V4" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        <path d="M16 28V24" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 16H4" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        <path d="M28 16H24" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `,
    className: 'mitr-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const emergencyIcon = createMitrIcon('#ef4444');
const normalIcon = createMitrIcon('#8b5cf6');

const API_BASE = 'https://mitr-api.onrender.com';
const API_KEY = 'mitrSos@2025';
const DEVICE_ID = 'device_1';

// Custom map controls component
function MapControls({ onZoomIn, onZoomOut, onLocate }) {
  return (
    <div className="map-controls">
      <button className="map-control-btn hover-scale" onClick={onZoomIn}>
        <FiPlus size={18} />
      </button>
      <button className="map-control-btn hover-scale" onClick={onZoomOut}>
        <FiX size={18} />
      </button>
      <button className="map-control-btn hover-scale" onClick={onLocate}>
        <FiNavigation size={18} />
      </button>
    </div>
  );
}

// Custom zoom handler component
function ZoomHandler({ onZoomIn, onZoomOut }) {
  const map = useMap();

  useEffect(() => {
    const handleZoomEnd = () => {
      const zoom = map.getZoom();
      // You can add any zoom-related logic here
    };

    map.on('zoomend', handleZoomEnd);
    return () => {
      map.off('zoomend', handleZoomEnd);
    };
  }, [map]);

  return null;
}

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
    status: 'Inactive',
    battery: 87,
    signal: 'Strong'
  });
  const [emergencyContacts] = useState([
    { name: 'Emergency Contact 1', phone: '+91 (9311953757)', relationship: 'Family', avatar: '👨‍👩‍👧' },
    { name: 'Emergency Contact 2', phone: '+91 (9310082225)', relationship: 'Friend', avatar: '👫' }
  ]);
  const [triggerWords] = useState(['Help me', 'Emergency', 'SOS', 'Danger', '911']);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notification, setNotification] = useState(null);
  const [map, setMap] = useState(null);

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('mitr-user'));
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }
    setUser(storedUser);
    showNotification('Welcome back to MITR Dashboard!');
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

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
      setDeviceInfo(prev => ({ 
        ...prev, 
        status: 'Active',
        battery: Math.max(0, prev.battery - 1)
      }));
      setError(null);
      
      if (data.coordinates?.length > 0) {
        showNotification('New location data received!');
        // Center map on new coordinates if map is available
        if (map && data.coordinates.length > 0) {
          const lastCoord = data.coordinates[data.coordinates.length - 1];
          map.flyTo([lastCoord.latitude, lastCoord.longitude], map.getZoom());
        }
      }
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
        showNotification('Emergency trigger stopped');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Failed to stop trigger');
      }
    } catch (err) {
      showNotification('Error stopping trigger');
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
        showNotification('Emergency mode activated!');
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
  }, [isTriggered, map]);

  const calculateCenter = () => {
    if (coordinates.length === 0) return [20.5937, 78.9629]; // Default to India center
    const sum = coordinates.reduce(
      (acc, coord) => ({
        lat: acc.lat + coord.latitude,
        lng: acc.lng + coord.longitude,
      }),
      { lat: 0, lng: 0 }
    );
    return [sum.lat / coordinates.length, sum.lng / coordinates.length];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const BatteryIndicator = ({ level }) => {
    let batteryIcon;
    if (level > 70) batteryIcon = <MdBatteryFull size={16} />;
    else if (level > 30) batteryIcon = <BsBatteryHalf size={16} />;
    else batteryIcon = <BsLightningFill size={16} className="text-yellow-500" />;

    return (
      <div className="flex items-center gap-2">
        <div className="battery-indicator">
          <div 
            className="battery-level" 
            style={{ width: `${level}%` }}
          ></div>
          <span>{level}%</span>
        </div>
        {batteryIcon}
      </div>
    );
  };

  const SignalIndicator = ({ strength }) => {
    const bars = {
      'Strong': 4,
      'Good': 3,
      'Weak': 2,
      'Poor': 1
    }[strength] || 0;
    
    return (
      <div className="flex items-center gap-2">
        <div className="signal-indicator">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`signal-bar ${i < bars ? 'active' : ''}`}
            ></div>
          ))}
        </div>
        <RiSignalWifiLine size={16} />
      </div>
    );
  };

  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

  const handleLocate = () => {
    if (map && coordinates.length > 0) {
      const lastCoord = coordinates[coordinates.length - 1];
      map.flyTo([lastCoord.latitude, lastCoord.longitude], 16);
    } else if (map) {
      map.flyTo(calculateCenter(), 5);
    }
  };

  if (!user) return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.p 
        className="loading-text"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Authenticating...
      </motion.p>
    </motion.div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <motion.div 
        className="sidebar"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <RiShieldUserLine size={20} />
            </div>
            MITR
          </div>
          <div className="user-badge">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-status">
                <span className="status-dot"></span>
                Verified User
              </div>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <motion.button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="nav-icon"><FiHome size={20} /></span>
            <span className="nav-text">Dashboard</span>
          </motion.button>
          <motion.button 
            className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab('map')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="nav-icon"><FiMap size={20} /></span>
            <span className="nav-text">Live Map</span>
          </motion.button>
          <motion.button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="nav-icon"><FiClock size={20} /></span>
            <span className="nav-text">History</span>
          </motion.button>
          <motion.button 
            className={`nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="nav-icon"><FiUsers size={20} /></span>
            <span className="nav-text">Contacts</span>
          </motion.button>
          <motion.button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="nav-icon"><FiSettings size={20} /></span>
            <span className="nav-text">Settings</span>
          </motion.button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="system-status">
            <div className="status-item">
              <span className="status-label">
                <FiPower size={14} /> System
              </span>
              <span className="status-value active">Online</span>
            </div>
            <div className="status-item">
              <span className="status-label">
                <FiWifi size={14} /> API
              </span>
              <span className="status-value active">Connected</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <h1 className="page-title">
            {activeTab === 'dashboard' && (
              <>
                <FiHome size={20} /> Safety Dashboard
              </>
            )}
            {activeTab === 'map' && (
              <>
                <FiMap size={20} /> Live Location Tracking
              </>
            )}
            {activeTab === 'history' && (
              <>
                <FiClock size={20} /> Location History
              </>
            )}
            {activeTab === 'contacts' && (
              <>
                <FiUsers size={20} /> Emergency Contacts
              </>
            )}
            {activeTab === 'settings' && (
              <>
                <FiSettings size={20} /> Settings
              </>
            )}
          </h1>
          
          <div className="header-actions">
            <motion.button 
              className="action-btn notification-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="badge">3</span>
              <IoMdNotificationsOutline size={18} />
            </motion.button>
            <motion.button 
              className="action-btn profile-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </motion.button>
          </div>
        </header>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              className="notification-banner"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <IoMdAlert size={18} />
              {notification}
              <button className="close-btn" onClick={() => setNotification(null)}>
                <FiX size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Content */}
        <div className="content-area">
          {activeTab === 'dashboard' && (
            <>
              {/* Status Cards */}
              <div className="content-grid">
                <motion.div 
                  className="card emergency-card"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="card-header">
                    <h3 className="card-title">Emergency Status</h3>
                    <div className="card-icon">
                      <IoMdAlert size={24} />
                    </div>
                  </div>
                  <div className="card-content">
                    <div className={`status-value ${isTriggered ? 'active' : 'inactive'}`}>
                      {isTriggered ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                    <p className="status-description">
                      {isTriggered 
                        ? 'Emergency mode is currently active' 
                        : 'Device is in standby mode'}
                    </p>
                    {isTriggered && (
                      <motion.button 
                        className="btn btn-error"
                        onClick={stopTrigger}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiStopCircle size={16} /> Stop Emergency
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                <motion.div 
                  className="card device-card"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="card-header">
                    <h3 className="card-title">Device Status</h3>
                    <div className="card-icon">
                      <FiSmartphone size={24} />
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="device-details">
                      <div className="detail-item">
                        <span className="detail-label">Battery:</span>
                        <BatteryIndicator level={deviceInfo.battery} />
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Signal:</span>
                        <SignalIndicator strength={deviceInfo.signal} />
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Last Update:</span>
                        <span className="detail-value">
                          {lastUpdate ? formatTime(lastUpdate) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="card location-card"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="card-header">
                    <h3 className="card-title">Current Location</h3>
                    <div className="card-icon">
                      <MdLocationOn size={24} />
                    </div>
                  </div>
                  <div className="card-content">
                    {coordinates.length > 0 ? (
                      <div className="location-info">
                        <div className="coordinates">
                          {coordinates[coordinates.length - 1].latitude.toFixed(6)}, 
                          {coordinates[coordinates.length - 1].longitude.toFixed(6)}
                        </div>
                        <div className="location-time">
                          {formatTime(coordinates[coordinates.length - 1].timestamp)}
                        </div>
                      </div>
                    ) : (
                      <div className="no-location">No location data available</div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Mini Map */}
              <motion.div 
                className="map-container mini-map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <MapContainer
                  center={calculateCenter()}
                  zoom={coordinates.length > 0 ? 13 : 5}
                  style={{ height: '100%', width: '100%' }}
                  whenCreated={setMap}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <ZoomHandler onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
                  {coordinates.map((coord, index) => (
                    <Marker
                      key={`${coord.deviceId}-${coord.timestamp}-${index}`}
                      position={[coord.latitude, coord.longitude]}
                      icon={isTriggered ? emergencyIcon : normalIcon}
                    >
                      <Popup className="futuristic-popup">
                        <strong>MITR Device</strong><br />
                        {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}<br />
                        {formatTime(coord.timestamp)}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                className="quick-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="section-title">
                  <BsLightningFill size={18} /> Quick Actions
                </h3>
                <div className="action-buttons">
                  <motion.button 
                    className="action-button primary"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="action-icon">
                      <MdEmergency size={20} />
                    </span>
                    <span className="action-text">Trigger Emergency</span>
                  </motion.button>
                  <motion.button 
                    className="action-button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="action-icon">
                      <MdCall size={20} />
                    </span>
                    <span className="action-text">Call Contacts</span>
                  </motion.button>
                  <motion.button 
                    className="action-button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="action-icon">
                      <FiNavigation size={20} />
                    </span>
                    <span className="action-text">Share Location</span>
                  </motion.button>
                  <motion.button 
                    className="action-button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="action-icon">
                      <MdBatteryFull size={20} />
                    </span>
                    <span className="action-text">Check Battery</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}

          {activeTab === 'map' && (
            <motion.div 
              className="map-container full-map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MapContainer
                center={calculateCenter()}
                zoom={coordinates.length > 0 ? 13 : 5}
                style={{ height: '100%', width: '100%' }}
                whenCreated={setMap}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ZoomHandler onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
                {coordinates.map((coord, index) => (
                  <Marker
                    key={`${coord.deviceId}-${coord.timestamp}-${index}`}
                    position={[coord.latitude, coord.longitude]}
                    icon={isTriggered ? emergencyIcon : normalIcon}
                  >
                    <Popup className="futuristic-popup">
                      <strong>MITR Device</strong><br />
                      {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}<br />
                      {formatTime(coord.timestamp)}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              
              <MapControls 
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onLocate={handleLocate}
              />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              className="table-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="table-header">
                <h3 className="section-title">
                  <IoMdTime size={20} /> Location History
                </h3>
                <div className="table-actions">
                  <motion.button 
                    className="btn btn-outline"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiCalendar size={16} /> Last 24h
                  </motion.button>
                  <motion.button 
                    className="btn btn-outline"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiDownload size={16} /> Export
                  </motion.button>
                </div>
              </div>
              
              <div className="history-table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Coordinates</th>
                      <th>Accuracy</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coordinates.length > 0 ? (
                      coordinates.map((coord, index) => (
                        <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td>{formatTime(coord.timestamp)}</td>
                          <td>
                            {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}
                          </td>
                          <td>±5m</td>
                          <td>
                            <motion.button 
                              className="table-action-btn"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiMap size={14} /> View
                            </motion.button>
                            <motion.button 
                              className="table-action-btn"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiNavigation size={14} /> Share
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">
                          No location history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'contacts' && (
            <motion.div 
              className="table-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="table-header">
                <h3 className="section-title">
                  <FiUsers size={20} /> Emergency Contacts
                </h3>
                <motion.button 
                  className="btn btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiPlus size={16} /> Add Contact
                </motion.button>
              </div>
              
              <div className="contacts-grid">
                {emergencyContacts.map((contact, index) => (
                  <motion.div 
                    className="contact-card"
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="contact-avatar">{contact.avatar}</div>
                    <div className="contact-info">
                      <h4 className="contact-name">{contact.name}</h4>
                      <div className="contact-phone">{contact.phone}</div>
                      <div className="contact-relationship">{contact.relationship}</div>
                    </div>
                    <div className="contact-actions">
                      <motion.button 
                        className="contact-action-btn call"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiPhone size={14} /> Call
                      </motion.button>
                      <motion.button 
                        className="contact-action-btn message"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiMessageSquare size={14} /> Message
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="trigger-words-section">
                <h4 className="section-title">
                  <FiAlertCircle size={18} /> Emergency Trigger Words
                </h4>
                <div className="trigger-words-list">
                  {triggerWords.map((word, index) => (
                    <motion.div 
                      className="trigger-word"
                      key={index}
                      whileHover={{ scale: 1.05 }}
                    >
                      <FiAlertCircle size={14} /> {word}
                    </motion.div>
                  ))}
                </div>
                <motion.button 
                  className="btn btn-outline"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiEdit size={16} /> Edit Trigger Words
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              className="table-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="settings-section">
                <h3 className="section-title">
                  <IoMdPerson size={20} /> Account Settings
                </h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={user.name} 
                      readOnly 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={user.email} 
                      readOnly 
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={user.phone || ''}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <motion.button 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
              
              <div className="settings-section">
                <h3 className="section-title">
                  <FiSmartphone size={20} /> Device Settings
                </h3>
                <div className="device-settings">
                  <div className="form-group">
                    <label>Device Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={deviceInfo.name}
                    />
                  </div>
                  <div className="form-group">
                    <label>Update Frequency</label>
                    <select className="form-control select-control">
                      <option>5 seconds (Emergency)</option>
                      <option>30 seconds (High)</option>
                      <option>1 minute (Medium)</option>
                      <option>5 minutes (Low)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location Accuracy</label>
                    <select className="form-control select-control">
                      <option>High (GPS)</option>
                      <option>Medium (WiFi/Cell)</option>
                      <option>Low (Cell only)</option>
                    </select>
                  </div>
                  <motion.button 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Update Device Settings
                  </motion.button>
                </div>
              </div>
              
              <div className="settings-section danger-zone">
                <h3 className="section-title">
                  <FiAlertCircle size={20} className="text-error" /> Danger Zone
                </h3>
                <div className="danger-actions">
                  <motion.button 
                    className="danger-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiAlertCircle size={16} /> Test Emergency Mode
                  </motion.button>
                  <motion.button 
                    className="danger-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiLock size={16} /> Change Password
                  </motion.button>
                  <motion.button 
                    className="danger-btn delete"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiTrash2 size={16} /> Delete Account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;