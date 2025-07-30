import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import MapComponent from '../components/MapComponent';
import { getSessionDetails } from '../services/api';
import './map.css';

function MapPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getSessionDetails(sessionId);
        setSession(response.data.session);
      } catch (err) {
        setError(err.message || 'Failed to fetch session details');
      }
    };
    fetchSession();
  }, [sessionId]);

  if (!session) return <div>Loading...</div>;

  const latestLocation = session.coordinates.length > 0 ? session.coordinates[session.coordinates.length - 1] : null;

  return (
    <div className="map-background">
      <div className="map-overlay-glow" />
      <Container className="map-container">
        <Card className="map-card glass-effect animate-slide-up">
          <Card.Body>
            <h3 className="text-gradient">Session: {sessionId}</h3>
            {error && <div className="error-message">{error}</div>}
            <MapComponent coordinates={session.coordinates} center={session.triggerStartLocation ? [session.triggerStartLocation.lat, session.triggerStartLocation.long] : null} />
            {latestLocation && (
              <div className="mt-3">
                <h4 className="text-gradient">Latest Location</h4>
                <p>Lat: {latestLocation.lat}, Long: {latestLocation.long}</p>
                <p>Time: {new Date(latestLocation.timestamp).toLocaleString()}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default MapPage;