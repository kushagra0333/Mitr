import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function DeviceCard({ device }) {
  const navigate = useNavigate();

  return (
    <Card className="device-card glass-effect animate-slide-up">
      <Card.Body>
        <Card.Title className="text-gradient">{device.deviceId}</Card.Title>
        <Card.Text>
          <strong>Status:</strong> {device.isTriggered ? 'Triggered' : 'Idle'}<br />
          <strong>Emergency Contacts:</strong> {device.emergencyContacts.length}<br />
          <strong>Trigger Words:</strong> {device.triggerWords.join(', ')}<br />
          <strong>Last Active:</strong> {device.lastActive ? new Date(device.lastActive).toLocaleString() : 'Never'}
        </Card.Text>
        <Button
          className="neon-btn"
          onClick={() => navigate(`/device/${device.deviceId}`)}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default DeviceCard;