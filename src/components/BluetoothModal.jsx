import { useState, useEffect } from 'react';
import { connectBluetoothDevice, sendDataToDevice } from '../services/bluetooth';
import './BluetoothModal.css';
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
      setError('');
      const availableDevices = await connectBluetoothDevice();
      setDevices(availableDevices);
    } catch (err) {
      setError('Failed to scan for devices');
      console.error('Bluetooth error:', err);
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
      emergency_contacts: emergencyContacts,
      trigger_words: triggerWords
    };
    try {
      await sendDataToDevice(selectedDevice, JSON.stringify(data));
      onSubmit({ emergencyContacts, triggerWords });
      onHide();
    } catch (err) {
      setError('Failed to send data to device');
      console.error('Bluetooth send error:', err);
    }
  };

  if (!show) return null;

  return (
    <div className="bluetooth-modal-overlay">
      <div className="bluetooth-modal">
        <div className="modal-header">
          <h3 className="gradient-text">Connect Device & Update Settings</h3>
          <button className="close-button" onClick={onHide}>&times;</button>
        </div>
        
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          
          <button onClick={scanDevices} className="refresh-button">
            Refresh Devices
          </button>
          
          <div className="devices-list">
            {devices.map((device, index) => (
              <div 
                key={index}
                className={`device-item ${selectedDevice === device ? 'selected' : ''}`}
                onClick={() => setSelectedDevice(device)}
              >
                {device.name || `Device ${index + 1}`}
              </div>
            ))}
          </div>
          
          <div className="form-section">
            <h4>Add Emergency Contact</h4>
            <div className="input-group">
              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
              <button onClick={handleAddContact} className="add-button">
                Add
              </button>
            </div>
            
            <div className="contacts-list">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="contact-item">
                  <span>{contact.name} - {contact.phone}</span>
                  <button 
                    onClick={() => handleRemoveContact(index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-section">
            <h4>Add Trigger Word</h4>
            <div className="input-group">
              <input
                type="text"
                placeholder="Trigger Word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
              <button onClick={handleAddWord} className="add-button">
                Add
              </button>
            </div>
            
            <div className="trigger-words-list">
              {triggerWords.map((word, index) => (
                <div key={index} className="trigger-word-item">
                  <span>{word}</span>
                  <button 
                    onClick={() => handleRemoveWord(index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="secondary-button" onClick={onHide}>
            Close
          </button>
          <button className="primary-button" onClick={handleSubmit}>
            Save & Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default BluetoothModal;