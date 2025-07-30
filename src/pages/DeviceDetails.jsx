import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Form } from 'react-bootstrap';
import MapComponent from '../components/MapComponent';
import BluetoothModal from '../components/BluetoothModal';
import { getDevice, startTrigger, stopTrigger, updateEmergencyContacts, updateTriggerWords } from '../services/api';
import './DeviceDetails.css';

function DeviceDetails() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await getDevice(deviceId);
        setDevice(response.data.device);
      } catch (err) {
        setError(err.message || 'Failed to fetch device details');
      }
    };
    fetchDevice();
  }, [deviceId]);

  const handleToggleTrigger = async () => {
    try {
      if (device.isTriggered) {
        await stopTrigger({ deviceId });
        setDevice({ ...device, isTriggered: false, currentLocation: null });
      } else {
        if (!apiKey) {
          setError('API Key is required to start trigger');
          return;
        }
        await startTrigger({ deviceId, initialLocation: null }, apiKey);
        const response = await getDevice(deviceId);
        setDevice(response.data.device);
      }
      setError('');
    } catch (err) {
      setError(err.message || `Failed to ${device.isTriggered ? 'stop' : 'start'} trigger`);
    }
  };

  const handleUpdateSettings = async ({ emergencyContacts, triggerWords }) => {
    try {
      await updateEmergencyContacts({ deviceId, emergencyContacts });
      await updateTriggerWords({ deviceId, triggerWords });
      const response = await getDevice(deviceId);
      setDevice(response.data.device);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    }
  };

  if (!device) return <div>Loading...</div>;

  return (
    <div className="device-details-background">
      <div className="device-details-overlay-glow" />
      <Container className="device-details-container">
        <Card className="device-card glass-effect animate-slide-up">
          <Card.Body>
            <h3 className="text-gradient">Device: {device.deviceId}</h3>
            {error && <div className="error-message">{error}</div>}
            <p><strong>Status:</strong> {device.isTriggered ? 'Triggered' : 'Idle'}</p>
            <p><strong>Last Active:</strong> {device.lastActive ? new Date(device.lastActive).toLocaleString() : 'Never'}</p>
            {device.isTriggered && device.currentLocation && (
              <>
                <h4 className="text-gradient">Current Location</h4>
                <MapComponent coordinates={[device.currentLocation]} center={[device.currentLocation.lat, device.currentLocation.long]} />
                <p>Lat: {device.currentLocation.lat}, Long: {device.currentLocation.long}</p>
              </>
            )}
            <Form.Group className="mb-3">
              <Form.Label>API Key (for triggering)</Form.Label>
              <Form.Control
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key"
              />
            </Form.Group>
            <Button
              className="neon-btn mt-2"
              onClick={handleToggleTrigger}
            >
              {device.isTriggered ? 'Stop Trigger' : 'Start Trigger'}
            </Button>
            <h4 className="text-gradient mt-3">Emergency Contacts</h4>
            <ListGroup>
              {device.emergencyContacts.map((contact, index) => (
                <ListGroup.Item key={index}>
                  {contact.name} - {contact.phone}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <h4 className="text-gradient mt-3">Trigger Words</h4>
            <ListGroup>
              {device.triggerWords.map((word, index) => (
                <ListGroup.Item key={index}>{word}</ListGroup.Item>
              ))}
            </ListGroup>
            <Button className="neon-btn mt-3" onClick={() => setShowBluetoothModal(true)}>
              Update Settings via Bluetooth
            </Button>
            <Button className="neon-btn mt-3 ms-2" onClick={() => navigate(`/history?deviceId=${deviceId}`)}>
              View Trigger History
            </Button>
          </Card.Body>
        </Card>
        <BluetoothModal
          show={showBluetoothModal}
          onHide={() => setShowBluetoothModal(false)}
          onSubmit={handleUpdateSettings}
          initialData={{ emergencyContacts: device.emergencyContacts, triggerWords: device.triggerWords }}
        />
      </Container>
    </div>
  );
}

export default DeviceDetails;