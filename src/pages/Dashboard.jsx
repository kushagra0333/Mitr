import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeviceCard from '../components/DeviceCard';
import { getProfile, linkDevice, createDevice } from '../services/api';
import './dashboard.css';

function Dashboard() {
  const [user, setUser] = useState({
    userID: '',
    email: '',
    deviceIds: [],
    devices: [],
    createdAt: new Date(),
  });
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [devicePassword, setDevicePassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        setUser({
          ...response.data.user,
          devices: response.data.user.devices || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch profile');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLinkDevice = async () => {
    try {
      setError('');
      if (!deviceId.trim() || !devicePassword.trim()) {
        throw new Error('Device ID and password are required');
      }
      if (!/^[A-Za-z0-9]+$/.test(deviceId.trim())) {
        throw new Error('Device ID must be alphanumeric');
      }
      if (devicePassword.length < 6) {
        throw new Error('Device password must be at least 6 characters');
      }

      const response = await linkDevice({
        deviceId: deviceId.trim(),
        devicePassword: devicePassword.trim(),
      });

      const profileResponse = await getProfile();
      setUser({
        ...profileResponse.data.user,
        devices: profileResponse.data.user.devices || [],
      });

      setShowLinkModal(false);
      setDeviceId('');
      setDevicePassword('');
      alert('Device linked successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to link device');
    }
  };

  const handleCreateDevice = async () => {
    try {
      setError('');
      if (!deviceId.trim() || !devicePassword.trim() || !apiKey.trim()) {
        throw new Error('Device ID, password, and API key are required');
      }
      if (!/^[A-Za-z0-9]+$/.test(deviceId.trim())) {
        throw new Error('Device ID must be alphanumeric');
      }
      if (devicePassword.length < 6) {
        throw new Error('Device password must be at least 6 characters');
      }

      const response = await createDevice(
        {
          deviceId: deviceId.trim(),
          devicePassword: devicePassword.trim(),
        },
        apiKey.trim()
      );

      setShowCreateModal(false);
      setDeviceId('');
      setDevicePassword('');
      setApiKey('');
      alert(`Device ${response.data.data.device.deviceId} created successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create device');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-overlay"></div>
      
      <div className="dashboard-content">
        <div className="user-profile-card">
          <h3 className="gradient-text">User Profile</h3>
          <div className="profile-details">
            <p><span>User ID:</span> {user.userID}</p>
            <p><span>Email:</span> {user.email}</p>
            <p><span>Devices Connected:</span> {user.deviceIds.length}</p>
            <p><span>Account Created:</span> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="devices-section">
          <div className="devices-header">
            <h3 className="gradient-text">Your Devices</h3>
            <div className="device-actions">
              <button className="glow-button" onClick={() => setShowCreateModal(true)}>
                Create Device
              </button>
              <button className="glow-button" onClick={() => setShowLinkModal(true)}>
                Add Device
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="devices-grid">
            {user.devices.length > 0 ? (
              user.devices.map(device => (
                <DeviceCard key={device._id} device={device} />
              ))
            ) : (
              <div className="no-devices">
                <p>No devices connected yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Link Device Modal */}
      {showLinkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="gradient-text">Link New Device</h3>
              <button className="close-button" onClick={() => { setShowLinkModal(false); setError(''); }}>&times;</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Device ID</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="Enter device ID (e.g., MITRDEVX5T9K2)"
                />
              </div>
              <div className="form-group">
                <label>Device Password</label>
                <input
                  type="password"
                  value={devicePassword}
                  onChange={(e) => setDevicePassword(e.target.value)}
                  placeholder="Enter device password (e.g., s3C4rT9z1Q)"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => { setShowLinkModal(false); setError(''); }}>
                Cancel
              </button>
              <button className="glow-button" onClick={handleLinkDevice}>
                Link Device
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Device Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="gradient-text">Create New Device</h3>
              <button className="close-button" onClick={() => { setShowCreateModal(false); setError(''); }}>&times;</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Device ID</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="Enter device ID (e.g., MITRDEVX5T9K2)"
                />
              </div>
              <div className="form-group">
                <label>Device Password</label>
                <input
                  type="password"
                  value={devicePassword}
                  onChange={(e) => setDevicePassword(e.target.value)}
                  placeholder="Enter device password (e.g., s3C4rT9z1Q)"
                />
              </div>
              <div className="form-group">
                <label>API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => { setShowCreateModal(false); setError(''); }}>
                Cancel
              </button>
              <button className="glow-button" onClick={handleCreateDevice}>
                Create Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;