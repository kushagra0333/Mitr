import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Table, Button } from 'react-bootstrap';
import { getSessionHistory } from '../services/api';
import './TriggerHistory.css';

function TriggerHistory() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const deviceId = query.get('deviceId');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getSessionHistory(deviceId);
        setSessions(response.data.sessions);
      } catch (err) {
        setError(err.message || 'Failed to fetch trigger history');
      }
    };
    fetchHistory();
  }, [deviceId]);

  return (
    <div className="history-background">
      <div className="history-overlay-glow" />
      <Container className="history-container">
        <Card className="history-card glass-effect animate-slide-up">
          <Card.Body>
            <h3 className="text-gradient">Trigger History {deviceId ? `for ${deviceId}` : ''}</h3>
            {error && <div className="error-message">{error}</div>}
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Device ID</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Coordinates</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session._id}>
                    <td>{session._id}</td>
                    <td>{session.deviceId}</td>
                    <td>{new Date(session.startTime).toLocaleString()}</td>
                    <td>{session.endTime ? new Date(session.endTime).toLocaleString() : 'Active'}</td>
                    <td>{session.active ? 'Active' : 'Ended'}</td>
                    <td>{session.coordinatesCount}</td>
                    <td>
                      <Button
                        className="neon-btn"
                        onClick={() => navigate(`/map/${session._id}`)}
                      >
                        View Map
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default TriggerHistory;