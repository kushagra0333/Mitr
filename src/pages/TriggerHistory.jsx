import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Table, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { getSessionHistory } from '../services/api';
import './TriggerHistory.css';

function TriggerHistory() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const deviceId = query.get('deviceId');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getSessionHistory(deviceId);
        if (response.sessions && Array.isArray(response.sessions)) {
          setSessions(response.sessions);
          setTotalPages(response.pagination?.totalPages || 1);
        } else {
          setError('No session data available');
          setSessions([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch trigger history');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    if (deviceId) {
      fetchHistory();
    } else {
      setError('No device ID provided');
      setLoading(false);
    }
  }, [deviceId, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="trigger-history-background">
        <Container className="trigger-history-container text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading trigger history...</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="trigger-history-background">
      <div className="trigger-history-overlay-glow" />
      <Container className="trigger-history-container py-5">
        <Card className="glass-effect animate-slide-up">
          <Card.Body>
            <Card.Title className="text-gradient">Trigger History</Card.Title>
            {deviceId && <Card.Subtitle className="mb-3">For Device: {deviceId}</Card.Subtitle>}

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
                <div className="mt-3">
                  <Button variant="primary" className="neon-btn" onClick={() => navigate('/devices')}>
                    Back to Devices
                  </Button>
                </div>
              </Alert>
            )}

            {!error && sessions.length === 0 && (
              <Alert variant="info">
                No trigger sessions found for this device
                <div className="mt-3">
                  <Button variant="primary" className="neon-btn" onClick={() => navigate('/devices')}>
                    Back to Devices
                  </Button>
                </div>
              </Alert>
            )}

            {sessions.length > 0 && (
              <>
                <Table striped bordered hover variant="dark" responsive className="sessions-table">
                  <thead>
                    <tr>
                      <th>Session ID</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => {
                      const startTime = new Date(session.startTime);
                      const endTime = session.endTime ? new Date(session.endTime) : null;
                      const duration = endTime
                        ? `${Math.round((endTime - startTime) / 60000)} minutes`
                        : 'Ongoing';

                      return (
                        <tr key={session._id}>
                          <td>{session._id.substring(0, 6)}...</td>
                          <td>{startTime.toLocaleString()}</td>
                          <td>{endTime ? endTime.toLocaleString() : 'Active'}</td>
                          <td>{duration}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                session.status === 'active' ? 'text-success' : 'text-danger'
                              }`}
                            >
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              className="neon-btn"
                              onClick={() => navigate(`/map/${session._id}`)}
                            >
                              View Map
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                {sessions.map((session) => (
                  <Card key={session._id} className="mt-3 glass-effect">
                    <Card.Body>
                      <Card.Subtitle className="text-gradient mb-2">
                        Session: {session._id.substring(0, 6)}...
                      </Card.Subtitle>
                      {session.coordinates?.length > 0 ? (
                        <ListGroup variant="flush">
                          {session.coordinates.map((coord, index) => (
                            <ListGroup.Item key={coord._id || index} className="small">
                              <div>
                                <strong>Time:</strong> {new Date(coord.timestamp).toLocaleString()}
                              </div>
                              <div>
                                <strong>Latitude:</strong> {coord.latitude.toFixed(6)},{' '}
                                <strong>Longitude:</strong> {coord.longitude.toFixed(6)}
                              </div>
                              {coord.accuracy && (
                                <div>
                                  <strong>Accuracy:</strong> {coord.accuracy.toFixed(2)} m
                                </div>
                              )}
                              {coord.speed && (
                                <div>
                                  <strong>Speed:</strong> {coord.speed.toFixed(2)} m/s
                                </div>
                              )}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <p className="text-muted">No location data recorded</p>
                      )}
                    </Card.Body>
                  </Card>
                ))}

                {totalPages > 1 && (
                  <div className="text-center mt-4">
                    <Button
                      variant="outline-primary"
                      className="neon-btn me-2"
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-light">Page {page} of {totalPages}</span>
                    <Button
                      variant="outline-primary"
                      className="neon-btn ms-2"
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default TriggerHistory;
