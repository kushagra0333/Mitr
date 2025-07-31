import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Container, Card, Button, ListGroup, Row, Col, Spinner, Alert } from 'react-bootstrap';
import BluetoothModal from '../components/BluetoothModal';
import { 
  getDevice, 
  stopTrigger, 
  getSessionHistory, 
  getSessionStatus,
  getSessionDetails,
} from '../services/api';
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
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionLocations, setSessionLocations] = useState([]);
  const apiKey = 'mitr@2025';

  const fetchSessionDetails = async (sessionId) => {
    try {
      const response = await getSessionDetails(sessionId);
      return response.data.session;
    } catch (err) {
      console.error('Error fetching session details:', err);
      return null;
    }
  };

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
      
      const isActive = statusResponse.data.isActive || false;
      setIsTriggered(isActive);

      // Get current session ID from status response if active
      const sessionId = isActive ? statusResponse.data.sessionId : null;
      setCurrentSessionId(sessionId);

      // If there's an active session, fetch its details
      if (sessionId) {
        const session = await fetchSessionDetails(sessionId);
        if (session) {
          setSessionLocations(session.coordinates || []);
          
          // Set current location to the last coordinate if available
          if (session.coordinates && session.coordinates.length > 0) {
            const lastCoord = session.coordinates[session.coordinates.length - 1];
            setCurrentLocation({
              latitude: lastCoord.latitude,
              longitude: lastCoord.longitude,
              timestamp: lastCoord.timestamp,
              tag: 'Latest Location'
            });
          }
        }
      } else {
        setSessionLocations([]);
      }

      // Handle single location update from status response
      if (
        isActive &&
        statusResponse.data.lastUpdate &&
        statusResponse.data.lastUpdate.latitude != null &&
        statusResponse.data.lastUpdate.longitude != null
      ) {
        const lat = Number(statusResponse.data.lastUpdate.latitude);
        const lon = Number(statusResponse.data.lastUpdate.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          const newLoc = {
            latitude: lat,
            longitude: lon,
            timestamp: statusResponse.data.lastUpdate.timestamp || new Date().toISOString(),
            tag: statusResponse.data.lastUpdate.tag || 'Emergency',
          };
          setCurrentLocation(newLoc);
        }
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
  }, [deviceId]);

  useEffect(() => {
    if (mapRef.current) {
      // Fit the map to show all markers if we have locations
      if (sessionLocations.length > 0) {
        const bounds = L.latLngBounds(
          sessionLocations.map(loc => [loc.latitude, loc.longitude])
        );
        
        // Include current location if available
        if (currentLocation) {
          bounds.extend([currentLocation.latitude, currentLocation.longitude]);
        }
        
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else if (currentLocation) {
        mapRef.current.setView([currentLocation.latitude, currentLocation.longitude], 15);
      } else {
        mapRef.current.setView([0, 0], 2); // Default view
      }
      mapRef.current.invalidateSize();
    }
  }, [currentLocation, sessionLocations]);

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
                    <strong>Current Session ID:</strong> {currentSessionId || 'None'}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Last Active:</strong>
                    {device.lastActive ? new Date(device.lastActive).toLocaleString() : 'Never'}
                  </ListGroup.Item>
                </ListGroup>
                <div className="mt-3 d-flex justify-content-between">
                  <Button
                    variant="primary"
                    className="neon-btn"
                    onClick={fetchData}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" /> Refreshing...
                      </>
                    ) : (
                      'Refresh Data'
                    )}
                  </Button>
                  {isTriggered && (
                    <Button
                      variant="info"
                      className="neon-btn"
                      onClick={() => navigate(`/map-live/${deviceId}`)}
                    >
                      View Live Map
                    </Button>
                  )}
                </div>
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

        <Row className="mb-4">
          <Col>
            <Card className="glass-effect animate-slide-up">
              <Card.Body>
                <Card.Title className="text-gradient">
                  {isTriggered ? 'Current Session Locations' : 'Device Status'}
                </Card.Title>
                <Row>
                  <Col md={6}>
                    <ListGroup>
                      <ListGroup.Item>
                        <strong>Status:</strong>{' '}
                        <span className={isTriggered ? 'text-danger' : 'text-success'}>
                          {isTriggered ? 'Triggered' : 'Not Triggered'}
                        </span>
                      </ListGroup.Item>
                      {isTriggered ? (
                        <>
                          <ListGroup.Item>
                            <strong>Latest Latitude:</strong>{' '}
                            {currentLocation && !isNaN(currentLocation.latitude)
                              ? currentLocation.latitude.toFixed(6)
                              : 'N/A'}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Latest Longitude:</strong>{' '}
                            {currentLocation && !isNaN(currentLocation.longitude)
                              ? currentLocation.longitude.toFixed(6)
                              : 'N/A'}
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Last Updated:</strong>{' '}
                            {currentLocation && currentLocation.timestamp
                              ? new Date(currentLocation.timestamp).toLocaleString()
                              : 'N/A'}
                          </ListGroup.Item>
                        </>
                      ) : (
                        <ListGroup.Item>
                          <span className="text-muted">Device is not currently triggered</span>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <div className="map-container">
                      {isTriggered ? (
                        <MapContainer
                          center={currentLocation ? [currentLocation.latitude, currentLocation.longitude] : [0, 0]}
                          zoom={currentLocation ? 15 : 2}
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
                          
                          {/* Current location marker */}
                          {currentLocation && (
                            <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
                              <Popup>
                                Latest Location<br />
                                Latitude: {currentLocation.latitude.toFixed(6)}<br />
                                Longitude: {currentLocation.longitude.toFixed(6)}<br />
                                Time: {new Date(currentLocation.timestamp).toLocaleString()}
                              </Popup>
                            </Marker>
                          )}
                          
                          {/* Session location markers */}
                          {sessionLocations.map((location, index) => (
                            <Marker
                              key={index}
                              position={[location.latitude, location.longitude]}
                            >
                              <Popup>
                                Location #{index + 1}<br />
                                Latitude: {location.latitude.toFixed(6)}<br />
                                Longitude: {location.longitude.toFixed(6)}<br />
                                Time: {new Date(location.timestamp).toLocaleString()}
                              </Popup>
                            </Marker>
                          ))}
                          
                          {/* Path for the session */}
                          {sessionLocations.length > 1 && (
                            <Polyline
                              positions={sessionLocations.map(loc => [loc.latitude, loc.longitude])}
                              color="#3388ff"
                              weight={3}
                            />
                          )}
                        </MapContainer>
                      ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                          <Alert variant="info" className="text-center">
                            Device is not currently triggered. No location data available.
                          </Alert>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

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
                            <strong>Session ID:</strong> {session._id}<br />
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

      </Container>
    </div>
  );
}

export default DeviceDetails;