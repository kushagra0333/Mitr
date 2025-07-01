// dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import { FaEdit, FaMapMarkerAlt, FaCog, FaBell, FaUser, FaLock, FaTrash, FaHistory } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import './dashboard.css';

// Fix for leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Reusable components with animations
const UserProfileCard = ({ user, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="dashboard-card glow-on-hover">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-white">User Profile</h5>
            <Button variant="outline-primary" size="sm" onClick={onEdit}>
              <FaEdit className="me-1" /> Edit
            </Button>
          </div>
          <div className="text-center mb-3">
            <div className="profile-avatar pulse-animation">
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
    </motion.div>
  );
};

const DeviceInfoCard = ({ device, onStopTriggering }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="dashboard-card glow-on-hover">
        <Card.Body>
          <h5 className="fw-bold text-white mb-3">Device Info</h5>
          <ListGroup variant="flush" className="bg-transparent">
            <ListGroup.Item className="bg-transparent text-white border-secondary">
              <strong>Device Name:</strong> {device.name}
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent text-white border-secondary">
              <strong>Device ID:</strong> {device.id}
            </ListGroup.Item>
            <ListGroup.Item className="bg-transparent text-white border-secondary">
              <strong>Status:</strong> <Badge bg="success">Active</Badge>
            </ListGroup.Item>
          </ListGroup>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="danger" 
              size="sm" 
              className="mt-3 w-100"
              onClick={onStopTriggering}
            >
              Stop Triggering
            </Button>
          </motion.div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

const EmergencyContactsCard = ({ contacts, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="dashboard-card glow-on-hover">
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
                <div className="d-flex align-items-center">
                  <div className="contact-avatar me-2">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{contact.relationship ? `${contact.relationship}: ` : ''}</strong>
                    {contact.name} - {contact.phone}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

const LocationTrackerCard = ({ tracking, onToggle, position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="dashboard-card glow-on-hover">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-white">Live Location</h5>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={tracking}
                onChange={onToggle}
                id="liveTrackingSwitch"
              />
              <label className="form-check-label text-white" htmlFor="liveTrackingSwitch">
                {tracking ? 'Active' : 'Inactive'}
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
              <Marker position={position}>
                <Popup>Your current location</Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <small className="text-muted">Last updated: Just now</small>
            <small className="text-primary">Accuracy: 10m</small>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

const TriggerWordsCard = ({ triggerWords, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="dashboard-card glow-on-hover">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-white">Trigger Words</h5>
            <Button variant="outline-primary" size="sm" onClick={onEdit}>
              <FaEdit className="me-1" /> Edit
            </Button>
          </div>
          <div className="trigger-words-container">
            {triggerWords.map((word, index) => (
              <motion.span 
                key={index} 
                className="trigger-word-badge"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div className="mt-3">
            <small className="text-muted">Say these words to activate emergency mode</small>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

const TriggerHistoryCard = ({ history, activeTrigger, setActiveTrigger }) => {
  // Sample trigger locations with timestamps
  const triggerLocations = [
    { position: [51.505, -0.09], date: 'Apr 10, 2024, 9:15 AM', type: 'Button Press' },
    { position: [51.51, -0.1], date: 'Mar 28, 2024, 6:30 PM', type: 'Keyword' },
    { position: [51.515, -0.095], date: 'Mar 15, 2024, 2:45 PM', type: 'Button Press' },
    { position: [51.5, -0.085], date: 'Mar 1, 2024, 11:20 AM', type: 'Keyword' },
  ];

  // Create polyline from all trigger locations
  const polyline = triggerLocations.map(loc => loc.position);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="dashboard-card glow-on-hover">
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <FaHistory className="me-2 text-primary" />
            <h5 className="fw-bold text-white mb-0">Trigger History</h5>
          </div>
          
          {/* Mini Map for Trigger Locations */}
          <div className="map-container mb-3" style={{ height: '150px' }}>
            <MapContainer
              center={triggerLocations[0].position}
              zoom={13}
              style={{ height: '100%', borderRadius: '8px' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Polyline 
                positions={polyline} 
                color="#bb86fc" 
                weight={3} 
                opacity={0.7} 
              />
              {triggerLocations.map((location, index) => (
                <Marker 
                  key={index} 
                  position={location.position}
                  eventHandlers={{
                    click: () => setActiveTrigger(index),
                  }}
                  icon={L.icon({
                    iconUrl: index === activeTrigger 
                      ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png'
                      : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                  })}
                >
                  <Popup>
                    <div>
                      <strong>{location.type}</strong><br />
                      {location.date}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <ListGroup variant="flush" className="bg-transparent">
            {history.map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <ListGroup.Item 
                  className={`bg-transparent text-white border-secondary ${activeTrigger === index ? 'active-trigger' : ''}`}
                  onClick={() => setActiveTrigger(index)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div>{item.date}</div>
                      <small className="text-muted">{item.location || 'Unknown location'}</small>
                    </div>
                    <Badge bg={item.type === 'Button Press' ? 'primary' : 'warning'}>
                      {item.type}
                    </Badge>
                  </div>
                </ListGroup.Item>
              </motion.div>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </motion.div>
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
    <Modal show={show} onHide={onHide} centered size="lg" className="settings-modal">
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
            </AnimatePresence>
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
    { date: 'Apr 10, 2024, 9:15 AM', type: 'Button Press', location: 'London, UK' },
    { date: 'Mar 28, 2024, 6:30 PM', type: 'Keyword', location: 'Manchester, UK' },
    { date: 'Mar 15, 2024, 2:45 PM', type: 'Button Press', location: 'Birmingham, UK' },
    { date: 'Mar 1, 2024, 11:20 AM', type: 'Keyword', location: 'Liverpool, UK' }
  ]);

  const [tracking, setTracking] = useState(true);
  const [position, setPosition] = useState([51.505, -0.09]); // Default to London
  const [showSettings, setShowSettings] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState(0);

  // Get user's actual location
  useEffect(() => {
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
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="d-flex justify-content-between align-items-center"
          >
            <h2 className="text-white fw-bold">Dashboard</h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="primary" 
                onClick={() => setShowSettings(true)}
                className="d-flex align-items-center"
              >
                <FaCog className="me-2" /> Settings
              </Button>
            </motion.div>
          </motion.div>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={3} lg={4} md={6}>
          <UserProfileCard user={user} onEdit={() => setShowSettings(true)} />
        </Col>
        <Col xl={3} lg={4} md={6}>
          <DeviceInfoCard device={device} onStopTriggering={handleStopTriggering} />
        </Col>
        <Col xl={3} lg={4} md={6}>
          <EmergencyContactsCard contacts={contacts} onEdit={() => setShowSettings(true)} />
        </Col>
        <Col xl={3} lg={6} md={6}>
          <TriggerWordsCard triggerWords={triggerWords} onEdit={() => setShowSettings(true)} />
        </Col>
        <Col xl={6} lg={6}>
          <LocationTrackerCard 
            tracking={tracking} 
            onToggle={handleToggleTracking} 
            position={position} 
          />
        </Col>
        <Col xl={6} lg={6}>
          <TriggerHistoryCard 
            history={history} 
            activeTrigger={activeTrigger}
            setActiveTrigger={setActiveTrigger}
          />
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