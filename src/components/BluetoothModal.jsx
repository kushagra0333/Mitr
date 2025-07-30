import { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { connectBluetoothDevice, sendDataToDevice } from '../services/bluetooth';

function BluetoothModal({ show, onHide, onSubmit, initialData }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState(initialData.emergencyContacts || []);
  const [triggerWords, setTriggerWords] = useState(initialData.triggerWords || []);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [newWord, setNewWord] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      scanDevices();
    }
  }, [show]);

  const scanDevices = async () => {
    try {
      const availableDevices = await connectBluetoothDevice();
      setDevices(availableDevices);
    } catch (err) {
      setError('Failed to scan for devices');
    }
  };

  const handleAddContact = () => {
    if (emergencyContacts.length >= 3) {
      setError('Maximum 3 emergency contacts allowed');
      return;
    }
    if (!newContact.name || !newContact.phone) {
      setError('Contact name and phone are required');
      return;
    }
    setEmergencyContacts([...emergencyContacts, newContact]);
    setNewContact({ name: '', phone: '' });
    setError('');
  };

  const handleRemoveContact = (index) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const handleAddWord = () => {
    if (!newWord) {
      setError('Trigger word is required');
      return;
    }
    setTriggerWords([...triggerWords, newWord]);
    setNewWord('');
    setError('');
  };

  const handleRemoveWord = (index) => {
    setTriggerWords(triggerWords.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedDevice) {
      setError('Please select a device');
      return;
    }
    const data = {
      emergency_contact: emergencyContacts.map(c => c.phone),
      trigger_word: triggerWords
    };
    try {
      await sendDataToDevice(selectedDevice, JSON.stringify(data));
      onSubmit({ emergencyContacts, triggerWords });
      onHide();
    } catch (err) {
      setError('Failed to send data to device');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="glass-effect">
      <Modal.Header closeButton>
        <Modal.Title className="text-gradient">Connect Device & Update Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="error-message">{error}</div>}
        <Button onClick={scanDevices} className="neon-btn mb-3">Refresh Devices</Button>
        <ListGroup className="mb-3">
          {devices.map((device, index) => (
            <ListGroup.Item
              key={index}
              active={selectedDevice === device}
              onClick={() => setSelectedDevice(device)}
              style={{ cursor: 'pointer', background: selectedDevice === device ? '#bb86fc' : 'transparent' }}
            >
              {device.name || `Device ${index + 1}`}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Add Emergency Contact</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
              <Form.Control
                type="tel"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
              <Button onClick={handleAddContact} className="neon-btn">Add</Button>
            </div>
          </Form.Group>
          <ListGroup className="mb-3">
            {emergencyContacts.map((contact, index) => (
              <ListGroup.Item key={index}>
                {contact.name} - {contact.phone}
                <Button variant="danger" size="sm" className="float-end" onClick={() => handleRemoveContact(index)}>
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form.Group className="mb-3">
            <Form.Label>Add Trigger Word</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Trigger Word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
              <Button onClick={handleAddWord} className="neon-btn">Add</Button>
            </div>
          </Form.Group>
          <ListGroup>
            {triggerWords.map((word, index) => (
              <ListGroup.Item key={index}>
                {word}
                <Button variant="danger" size="sm" className="float-end" onClick={() => handleRemoveWord(index)}>
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button className="neon-btn" onClick={handleSubmit}>Save & Send</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BluetoothModal;