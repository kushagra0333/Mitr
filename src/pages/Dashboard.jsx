import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DeviceCard from '../components/DeviceCard';
import { getProfile, linkDevice } from '../services/api';
import './dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [devicePassword, setDevicePassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data.user);
      } catch (err) {
        setError(err.message || 'Failed to fetch profile');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLinkDevice = async () => {
    try {
      await linkDevice({ deviceId, devicePassword });
      setShowModal(false);
      setDeviceId('');
      setDevicePassword('');
      setError('');
      const response = await getProfile();
      setUser(response.data.user);
    } catch (err) {
      setError(err.message || 'Failed to link device');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-background">
      <div className="dashboard-overlay-glow" />
      <Container className="dashboard-container">
        <Card className="user-info-card glass-effect animate-slide-up">
          <Card.Body className="text-white">
            <h3 className="text-gradient">User Profile</h3>
            <p><strong>User ID:</strong> {user.userID}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Devices Connected:</strong> {user.deviceIds.length}</p>
            <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          </Card.Body>
        </Card>

        <div className="device-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="text-gradient">Your Devices</h3>
            <Button className="neon-btn" onClick={() => setShowModal(true)}>Add Device</Button>
          </div>
          {error && <div className="error-message">{error}</div>}
          <Row>
            {user.devices.map(device => (
              <Col md={4} key={device.deviceId} className="mb-4">
                <DeviceCard device={device} />
              </Col>
            ))}
          </Row>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered className="glass-effect">
          <Modal.Header closeButton>
            <Modal.Title className="text-gradient">Link New Device</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <div className="error-message">{error}</div>}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Device ID</Form.Label>
                <Form.Control
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="Enter device ID"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Device Password</Form.Label>
                <Form.Control
                  type="password"
                  value={devicePassword}
                  onChange={(e) => setDevicePassword(e.target.value)}
                  placeholder="Enter device password"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button className="neon-btn" onClick={handleLinkDevice}>Link Device</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Dashboard;