import { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { FaBluetooth, FaRedo, FaCheck } from 'react-icons/fa';
import BluetoothService from '../services/bluetooth';
import './BluetoothModal.css';

function BluetoothModal({ show, onHide, onSubmit, initialData }) {
  const [status, setStatus] = useState('idle'); // idle, scanning, connected, error
  const [error, setError] = useState('');
  const [connection, setConnection] = useState(null); // { device, characteristic }
  const [settings, setSettings] = useState({
    emergencyContacts: initialData.emergencyContacts || [],
    triggerWords: initialData.triggerWords || []
  });
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [newWord, setNewWord] = useState('');

  useEffect(() => {
    if (show) {
      setStatus('idle');
      setError('');
    }
  }, [show]);

  const handleScan = async () => {
    setStatus('scanning');
    setError('');
    
    try {
      const conn = await BluetoothService.connect(); // FIXED
      setConnection(conn);
      setStatus('connected');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleAddContact = () => {
    if (settings.emergencyContacts.length >= 3) {
      setError('Maximum 3 emergency contacts allowed');
      return;
    }
    if (!newContact.name || !newContact.phone) {
      setError('Contact name and phone are required');
      return;
    }
    setSettings(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact]
    }));
    setNewContact({ name: '', phone: '' });
    setError('');
  };

  const handleAddWord = () => {
    if (!newWord.trim()) {
      setError('Trigger word is required');
      return;
    }
    setSettings(prev => ({
      ...prev,
      triggerWords: [...prev.triggerWords, newWord.trim()]
    }));
    setNewWord('');
    setError('');
  };
const handleSubmit = async () => {
  try {
    if (!connection) throw new Error('No device connected');

    // Prepare JSON format expected by device
    const jsonToSend = {
      emergency_contact: settings.emergencyContacts.map(c => c.phone),
      trigger_word: settings.triggerWords
    };

    // Step 1: Send to Bluetooth device
    await BluetoothService.sendJson(connection.characteristic, jsonToSend);

    // ✅ Step 2: Update settings to your backend server
    await fetch('/api/update-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emergencyContacts: settings.emergencyContacts,
        triggerWords: settings.triggerWords
      })
    });

    // Step 3: Trigger onSubmit callback and close modal
    onSubmit({
      emergencyContacts: settings.emergencyContacts,
      triggerWords: settings.triggerWords,
      deviceConnection: connection.device
    });
    onHide();
  } catch (err) {
    setError(`Failed to send settings: ${err.message}`);
  }
};
  if (!show) return null;

  return (
    <div className="bluetooth-modal-overlay">
      <Card className="bluetooth-modal-card glass-effect">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="text-gradient mb-0">
            <FaBluetooth className="me-2" />
            Device Settings
          </h4>
          <Button variant="close" onClick={onHide} />
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="mb-4">
            <h5>Bluetooth Connection</h5>
            {status === 'idle' && (
              <Button variant="primary" onClick={handleScan} className="w-100">
                <FaBluetooth className="me-2" />
                Scan for Devices
              </Button>
            )}

            {status === 'scanning' && (
              <div className="text-center py-3">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Searching for MITR devices...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <Alert variant="warning" className="text-start">
                  <p>Ensure:</p>
                  <ListGroup variant="flush">
                    <ListGroup.Item>• Bluetooth is enabled</ListGroup.Item>
                    <ListGroup.Item>• Device is in pairing mode</ListGroup.Item>
                    <ListGroup.Item>• Using Chrome/Edge</ListGroup.Item>
                    <ListGroup.Item>• Site loaded via HTTPS</ListGroup.Item>
                  </ListGroup>
                </Alert>
                <Button variant="outline-primary" onClick={handleScan} className="mt-2">
                  <FaRedo className="me-2" />
                  Try Again
                </Button>
              </div>
            )}

            {status === 'connected' && (
              <Alert variant="success" className="d-flex align-items-center">
                <FaCheck className="me-2" />
                Connected to: <strong className="ms-1">{connection?.device?.name || 'Unknown Device'}</strong>
              </Alert>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="mb-4">
            <h5>Emergency Contacts</h5>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              />
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              />
              <Button variant="outline-primary" onClick={handleAddContact}>
                Add
              </Button>
            </div>
            <ListGroup>
              {settings.emergencyContacts.map((contact, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <span>{contact.name} - {contact.phone}</span>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
                    }))}
                  >
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* Trigger Words */}
          <div className="mb-4">
            <h5>Trigger Words</h5>
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="New trigger word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
              <Button variant="outline-primary" onClick={handleAddWord}>
                Add
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {settings.triggerWords.map((word, index) => (
                <span key={index} className="badge bg-primary d-flex align-items-center">
                  {word}
                  <button 
                    className="btn-close btn-close-white ms-2" 
                    style={{ fontSize: '0.5rem' }}
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      triggerWords: prev.triggerWords.filter((_, i) => i !== index)
                    }))}
                  />
                </span>
              ))}
            </div>
          </div>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={status !== 'connected'}>
            Save & Send to Device
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default BluetoothModal;
