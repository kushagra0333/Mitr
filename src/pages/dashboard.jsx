// dashboard.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form, Spinner } from 'react-bootstrap';
import { FaEdit, FaMapMarkerAlt, FaCog, FaBell, FaUser, FaLock, FaTrash } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './dashboard.css';

// Reusable components
const UserProfileCard = ({ user, onEdit }) => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white">User Profile</h5>
          <Button variant="outline-primary" size="sm" onClick={onEdit}>
            <FaEdit className="me-1" /> Edit
          </Button>
        </div>
        <div className="text-center mb-3">
          <div className="profile-avatar">
            {user.name.charAt(0)}
          </div>
          <h4 className="mt-3 text-white">{user.name}</h4>
          <p className="text-muted">{user.email}</p>
        </div>
        <ListGroup variant="flush" className="bg-transparent">
          <ListGroup.Item className="bg-transparent text-white border-secondary">
            <strong>Email:</strong> {user.email}
          </ListGroup.Item>
          <ListGroup.Item className="bg-transparent text-white border-secondary">
            <strong>Phone:</strong> {user.phone}
          </ListGroup.Item>
          <ListGroup.Item className="bg-transparent text-white border-secondary">
            <strong>User ID:</strong> {user.userId}
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

const DeviceInfoCard = ({ device, onStopTriggering }) => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <h5 className="fw-bold text-white mb-3">Device Info</h5>
        <ListGroup variant="flush" className="bg-transparent">
          <ListGroup.Item className="bg-transparent text-white border-secondary">
            <strong>Device Name:</strong> {device.name}
          </ListGroup.Item>
          <ListGroup.Item className="bg-transparent text-white border-secondary">
            <strong>Device ID:</strong> {device.id}
          </ListGroup.Item>
        </ListGroup>
        <Button 
          variant="danger" 
          size="sm" 
          className="mt-3 w-100"
          onClick={onStopTriggering}
        >
          Stop Triggering
        </Button>
      </Card.Body>
    </Card>
  );
};

const EmergencyContactsCard = ({ contacts, onEdit }) => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white">Emergency Contacts</h5>
          <Button variant="outline-primary" size="sm" onClick={onEdit}>
            <FaEdit className="me-1" /> Edit
          </Button>
        </div>
        <ListGroup variant="flush" className="bg-transparent">
          {contacts.map((contact, index) => (
            <ListGroup.Item key={index} className="bg-transparent text-white border-secondary">
              <strong>{contact.relationship ? `${contact.relationship}: ` : ''}</strong>
              {contact.name} - {contact.phone}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

const LocationTrackerCard = ({ tracking, onToggle, position }) => {
  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <Card className="dashboard-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white">Location Tracker</h5>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={tracking}
              onChange={onToggle}
              id="liveTrackingSwitch"
            />
            <label className="form-check-label text-white" htmlFor="liveTrackingSwitch">
              Live Tracking {tracking ? 'On' : 'Off'}
            </label>
          </div>
        </div>
        <div className="map-container">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: '200px', borderRadius: '8px' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={customIcon}>
              <Popup>Your current location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

const TriggerWordsCard = ({ triggerWords, onEdit }) => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white">Trigger Words</h5>
          <Button variant="outline-primary" size="sm" onClick={onEdit}>
            <FaEdit className="me-1" /> Edit
          </Button>
        </div>
        <div className="trigger-words-container">
          {triggerWords.map((word, index) => (
            <span key={index} className="trigger-word-badge">
              {word}
            </span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

const TriggerHistoryCard = ({ history }) => {
  return (
    <Card className="dashboard-card">
      <Card.Body>
        <h5 className="fw-bold text-white mb-3">Trigger History</h5>
        <ListGroup variant="flush" className="bg-transparent">
          {history.map((item, index) => (
            <ListGroup.Item key={index} className="bg-transparent text-white border-secondary">
              <div className="d-flex justify-content-between">
                <span>{item.date}</span>
                <span className="text-primary">{item.type}</span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

const SettingsModal = ({ show, onHide, user, onSave }) => {
  const [formData, setFormData] = useState(user);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onHide();
    }, 1000);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-secondary">
        <Modal.Title className="text-white">Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="d-flex">
          <div className="settings-sidebar bg-dark">
            <button
              className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="me-2" /> Profile
            </button>
            <button
              className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FaLock className="me-2" /> Security
            </button>
            <button
              className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <FaBell className="me-2" /> Notifications
            </button>
            <button
              className={`settings-tab ${activeTab === 'danger' ? 'active' : ''}`}
              onClick={() => setActiveTab('danger')}
            >
              <FaTrash className="me-2" /> Danger Zone
            </button>
          </div>
          <div className="settings-content p-4">
            {activeTab === 'profile' && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="text-end">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" /> : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            )}
            {activeTab === 'security' && (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                  />
                </Form.Group>
                <div className="text-end">
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" /> : 'Update Password'}
                  </Button>
                </div>
              </Form>
            )}
            {activeTab === 'notifications' && (
              <div>
                <h5>Notification Preferences</h5>
                <Form.Check
                  type="switch"
                  id="emailNotifications"
                  label="Email Notifications"
                  defaultChecked
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="smsNotifications"
                  label="SMS Notifications"
                  defaultChecked
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="pushNotifications"
                  label="Push Notifications"
                  defaultChecked
                  className="mb-3"
                />
                <div className="text-end">
                  <Button variant="primary" disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" /> : 'Save Preferences'}
                  </Button>
                </div>
              </div>
            )}
            {activeTab === 'danger' && (
              <div>
                <h5 className="text-danger">Danger Zone</h5>
                <p className="text-muted">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div className="mt-4">
                  <Button variant="outline-danger" className="me-3">
                    Deactivate Account
                  </Button>
                  <Button variant="danger">
                    Delete Account Permanently
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const Dashboard = () => {
  // Sample data
  const [user, setUser] = useState({
    name: 'David Clark',
    email: 'david@example.com',
    phone: '(123) 456-7390',
    userId: '123456'
  });

  const [device, setDevice] = useState({
    name: 'MITR Mini',
    id: 'MITR4XL80X'
  });

  const [contacts, setContacts] = useState([
    { name: 'John Smith', phone: '(234) 567-8901', relationship: '' },
    { name: 'Jane Doe', phone: '(345) 678-9012', relationship: 'Spouse' },
    { name: 'Michael Brown', phone: '(456) 789-0123', relationship: 'Parent' }
  ]);

  const [triggerWords, setTriggerWords] = useState(['Help me', 'Emergency', 'SOS']);
  
  const [history, setHistory] = useState([
    { date: 'Apr 10, 2024, 9:15 AM', type: 'Button Press' },
    { date: 'Mar 28, 2024, 6:30 PM', type: 'Keyword' }
  ]);

  const [tracking, setTracking] = useState(true);
  const [position, setPosition] = useState([51.505, -0.09]); // Default to London
  const [showSettings, setShowSettings] = useState(false);

  // Get user's actual location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Error getting location:", err);
        }
      );
    }
  }, []);

  const handleStopTriggering = () => {
    alert('Triggering stopped');
  };

  const handleToggleTracking = () => {
    setTracking(!tracking);
  };

  const handleSaveSettings = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <Container fluid className="dashboard-container">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-white fw-bold">Dashboard</h2>
            <Button 
              variant="primary" 
              onClick={() => setShowSettings(true)}
              className="d-flex align-items-center"
            >
              <FaCog className="me-2" /> Settings
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={4} md={6}>
          <UserProfileCard user={user} onEdit={() => setShowSettings(true)} />
        </Col>
        <Col lg={4} md={6}>
          <DeviceInfoCard device={device} onStopTriggering={handleStopTriggering} />
        </Col>
        <Col lg={4} md={6}>
          <EmergencyContactsCard contacts={contacts} onEdit={() => setShowSettings(true)} />
        </Col>
        <Col lg={6} md={6}>
          <LocationTrackerCard 
            tracking={tracking} 
            onToggle={handleToggleTracking} 
            position={position} 
          />
        </Col>
        <Col lg={3} md={6}>
          <TriggerWordsCard triggerWords={triggerWords} onEdit={() => setShowSettings(true)} />
        </Col>
        <Col lg={3} md={6}>
          <TriggerHistoryCard history={history} />
        </Col>
      </Row>

      <SettingsModal 
        show={showSettings} 
        onHide={() => setShowSettings(false)} 
        user={user} 
        onSave={handleSaveSettings} 
      />
    </Container>
  );
};

export default Dashboard;