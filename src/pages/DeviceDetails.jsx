import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Container, Card, Button, ListGroup, Row, Col, Spinner, Alert } from 'react-bootstrap';
import BluetoothModal from '../components/BluetoothModal';
import { 
  getDevice, 
  stopTrigger, 
  getSessionHistory, 
  getSessionStatus,
  updateEmergencyContacts,
  updateTriggerWords
} from '../services/api';
import { sendDataToDevice } from '../services/bluetooth';
import './DeviceDetails.css';

// Fix for Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function DeviceDetails() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [device, setDevice] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isStopping, setIsStopping] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const apiKey = 'mitr@2025';

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [deviceResponse, historyResponse, statusResponse] = await Promise.all([
        getDevice(deviceId),
        getSessionHistory(deviceId),
        getSessionStatus(deviceId),
      ]);

      setDevice(deviceResponse.data.device);
      setHistory(historyResponse.sessions || []);
      setIsTriggered(statusResponse.data.isActive || false);

      if (
        statusResponse.data.isActive &&
        statusResponse.data.lastUpdate &&
        typeof statusResponse.data.lastUpdate.latitude === 'number' &&
        typeof statusResponse.data.lastUpdate.longitude === 'number' &&
        !isNaN(statusResponse.data.lastUpdate.latitude) &&
        !isNaN(statusResponse.data.lastUpdate.longitude)
      ) {
        const newLoc = {
          latitude: statusResponse.data.lastUpdate.latitude,
          longitude: statusResponse.data.lastUpdate.longitude,
          timestamp: statusResponse.data.lastUpdate.timestamp,
        };
        setCurrentLocation(newLoc);
      } else {
        setCurrentLocation(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    let intervalId = null;
    if (isTriggered) {
      intervalId = setInterval(fetchData, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [deviceId, isTriggered]);

  useEffect(() => {
    if (mapRef.current && currentLocation && typeof currentLocation.latitude === 'number' && typeof currentLocation.longitude === 'number') {
      mapRef.current.setView([currentLocation.latitude, currentLocation.longitude], 15);
      mapRef.current.invalidateSize(); // Ensure map renders correctly
    }
  }, [currentLocation]);

  const handleStopTrigger = async () => {
    try {
      setIsStopping(true);
      setError('');
      await stopTrigger(deviceId, apiKey);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to stop trigger');
      console.error('Stop trigger error:', err);
    } finally {
      setIsStopping(false);
    }
  };

  const handleUpdateSettings = async ({ emergencyContacts, triggerWords, deviceConnection }) => {
    try {
      setError('');
      await Promise.all([
        updateEmergencyContacts(deviceId, emergencyContacts),
        updateTriggerWords(deviceId, triggerWords)
      ]);

      if (deviceConnection) {
        const deviceData = {
          emergency_contact: emergencyContacts.map(contact => contact.phone),
          trigger_word: triggerWords
        };
        await sendDataToDevice(deviceConnection, JSON.stringify(deviceData));
      } else {
        console.warn('No Bluetooth device connected, settings not sent to device');
      }

      const deviceResponse = await getDevice(deviceId);
      setDevice(deviceResponse.data.device);
      setShowBluetoothModal(false);
    } catch (err) {
      setError(err.message || 'Failed to update settings or send to device');
      console.error('Update settings error:', err);
    }
  };

  if (loading) {
    return (
      <div className="device-details-background">
        <Container className="device-details-container text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading device details...</p>
        </Container>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="device-details-background">
        <Container className="device-details-container py-5">
          <Alert variant="danger">
            {error || 'Device not found or failed to load'}
          </Alert>
          <Button variant="primary" className="neon-btn" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="device-details-background">
      <div className="device-details-overlay-glow" />
      <Container className="device-details-container">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Row className="mb-4">
          <Col md={6}>
            <Card className="glass-effect animate-slide-up h-100">
              <Card.Body>
                <Card.Title className="text-gradient">Device Details</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Device ID:</strong> {device.deviceId}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong>
                    <span className={isTriggered ? 'text-danger' : 'text-success'}>
                      {isTriggered ? ' Triggered' : ' Idle'}
                    </span>
                    {isTriggered && (
                      <Button
                        variant="danger"
                        className="ms-3 neon-btn"
                        onClick={handleStopTrigger}
                        disabled={isStopping}
                      >
                        {isStopping ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" /> Stopping...
                          </>
                        ) : (
                          'Stop Triggering'
                        )}
                      </Button>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Last Active:</strong>
                    {device.lastActive ? new Date(device.lastActive).toLocaleString() : 'Never'}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="glass-effect animate-slide-up h-100">
              <Card.Body>
                <Card.Title className="text-gradient">Settings</Card.Title>
                <Card.Subtitle className="text-gradient mb-2">Emergency Contacts</Card.Subtitle>
                {device.emergencyContacts?.length > 0 ? (
                  <ListGroup className="mb-3">
                    {device.emergencyContacts.map((contact, index) => (
                      <ListGroup.Item key={index}>
                        <strong>{contact.name}</strong>: {contact.phone}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted">No emergency contacts set</p>
                )}

                <Card.Subtitle className="text-gradient mb-2">Trigger Words</Card.Subtitle>
                {device.triggerWords?.length > 0 ? (
                  <ListGroup horizontal className="mb-3 flex-wrap">
                    {device.triggerWords.map((word, index) => (
                      <ListGroup.Item key={index} className="m-1">
                        {word}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted">No trigger words set</p>
                )}

                <Button
                  variant="outline-primary"
                  className="w-100 mt-2 neon-btn"
                  onClick={() => setShowBluetoothModal(true)}
                >
                  Edit Settings
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {isTriggered && currentLocation && currentLocation.latitude != null && currentLocation.longitude != null && (
          <Row className="mb-4">
            <Col>
              <Card className="glass-effect animate-slide-up">
                <Card.Body>
                  <Card.Title className="text-gradient">Current Location</Card.Title>
                  <Row>
                    <Col md={6}>
                      <ListGroup>
                        <ListGroup.Item>
                          <strong>Latitude:</strong>{' '}
                          {typeof currentLocation.latitude === 'number' && !isNaN(currentLocation.latitude)
                            ? currentLocation.latitude.toFixed(6)
                            : 'N/A'}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Longitude:</strong>{' '}
                          {typeof currentLocation.longitude === 'number' && !isNaN(currentLocation.longitude)
                            ? currentLocation.longitude.toFixed(6)
                            : 'N/A'}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Last Updated:</strong>{' '}
                          {currentLocation.timestamp
                            ? new Date(currentLocation.timestamp).toLocaleString()
                            : 'N/A'}
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <div className="map-container" style={{ height: '300px', borderRadius: '8px', overflow: 'hidden' }}>
                        <MapContainer
                          center={
                            typeof currentLocation.latitude === 'number' &&
                            typeof currentLocation.longitude === 'number' &&
                            !isNaN(currentLocation.latitude) &&
                            !isNaN(currentLocation.longitude)
                              ? [currentLocation.latitude, currentLocation.longitude]
                              : [0, 0]
                          }
                          zoom={15}
                          style={{ height: '100%', width: '100%' }}
                          whenCreated={(map) => {
                            mapRef.current = map;
                            map.invalidateSize();
                          }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          />
                          {typeof currentLocation.latitude === 'number' &&
                            typeof currentLocation.longitude === 'number' &&
                            !isNaN(currentLocation.latitude) &&
                            !isNaN(currentLocation.longitude) && (
                              <Marker
                                position={[currentLocation.latitude, currentLocation.longitude]}
                              >
                                <Popup>
                                  Current Location
                                  <br />
                                  {currentLocation.latitude.toFixed(6)},{' '}
                                  {currentLocation.longitude.toFixed(6)}
                                </Popup>
                              </Marker>
                            )}
                        </MapContainer>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col>
            <Card className="glass-effect animate-slide-up">
              <Card.Body>
                <Card.Title className="text-gradient">Recent Trigger History</Card.Title>
                {history.length > 0 ? (
                  <ListGroup variant="flush">
                    {history.slice(0, 3).map((session, index) => (
                      <ListGroup.Item key={session._id || index}>
                        <div className="d-flex justify-content-between mb-2">
                          <div>
                            <strong>Started:</strong> {new Date(session.startTime).toLocaleString()}
                          </div>
                          <div>
                            <strong>Duration:</strong>
                            {session.endTime
                              ? `${Math.round(
                                  (new Date(session.endTime) - new Date(session.startTime)) / 60000
                                )} mins`
                              : 'Ongoing'}
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted">No trigger history available</p>
                )}
                <div className="text-center mt-3">
                  <Button
                    variant="primary"
                    className="neon-btn"
                    onClick={() => navigate(`/history?deviceId=${deviceId}`)}
                  >
                    View Full History
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <BluetoothModal
          show={showBluetoothModal}
          onHide={() => setShowBluetoothModal(false)}
          onSubmit={handleUpdateSettings}
          initialData={{
            emergencyContacts: device.emergencyContacts || [],
            triggerWords: device.triggerWords || []
          }}
          onDeviceSelect={setSelectedDevice}
        />
      </Container>
    </div>
  );
}

export default DeviceDetails;
