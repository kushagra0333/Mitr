
import React, { useState ,useEffect } from "react";
import { Container, Button, Card, Row, Col, ListGroup, Modal, Spinner, Form } from "react-bootstrap";  // <-- Added 'Form' import
import { FaPlus, FaBluetooth, FaEdit, FaExclamationTriangle, FaUnlink } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";

const EditDevice = ({ show, onClose, device }) => {
  // Always call useState at the top of your component
  const [name, setName] = useState("");
  const [triggerWords, setTriggerWords] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Effect to initialize state when device prop changes
  useEffect(() => {
    if (device) {
      setName(device.name || "");
      setTriggerWords(device.triggerWords || []);
      setContacts(device.contacts || []);
    }
  }, [device]);

  const handleTriggerWordsChange = (e) => {
    const words = e.target.value.split(",").map((word) => word.trim());
    setTriggerWords(words);
  };

  const handleAddContact = () => {
    setContacts([
      ...contacts,
      { name: "", phone: "", modes: "" },
    ]);
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  const handleSave = () => {
    // Save logic here
    onClose();
  };

  const handleRemoveContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  };

  if (!device) {
    return <div>Loading...</div>; // Show loading state while device data is not available
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit {device.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Device Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trigger Words (comma-separated)</Form.Label>
            <Form.Control
              value={triggerWords.join(", ")}
              onChange={handleTriggerWordsChange}
            />
            <div className="mt-2">
              <p><strong>Current Trigger Words:</strong></p>
              <ListGroup>
                {triggerWords.map((word, idx) => (
                  <ListGroup.Item key={idx}>{word}</ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Emergency Contacts</Form.Label>
            {contacts.map((contact, idx) => (
              <Row key={idx} className="mb-3">
                <Col md={4}>
                  <Form.Control
                    placeholder="Name"
                    value={contact.name}
                    onChange={(e) =>
                      handleContactChange(idx, "name", e.target.value)
                    }
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={(e) =>
                      handleContactChange(idx, "phone", e.target.value)
                    }
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    placeholder="Modes (WhatsApp, SMS)"
                    value={contact.modes}
                    onChange={(e) =>
                      handleContactChange(idx, "modes", e.target.value)
                    }
                  />
                </Col>
                <Button
                  variant="danger"
                  className="mt-2"
                  onClick={() => handleRemoveContact(idx)}
                >
                  Remove
                </Button>
              </Row>
            ))}
            <Button variant="secondary" onClick={handleAddContact}>
              Add New Contact
            </Button>
          </Form.Group>

          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
// Reusable Bluetooth Function to Add Device
const addDeviceBluetooth = async (setDevices, devices, setShowAddModal, setLoading) => {
  try {
    setLoading(true); // Start signal animation (loading)
    
    // Request Bluetooth device (using Web Bluetooth API)
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['device_information'] }], // Filter by device services
      optionalServices: ['battery_service'], // You can add more optional services if needed
    });

    // Connect to the device
    const server = await device.gatt.connect();  // You can remove this if you're not using it

    // Get device information (e.g., name, signal strength, etc.)
    const deviceName = device.name || "Unknown Device";
    const signalStrength = "Good"; // For example, you can get the RSSI value for signal strength

    // Create new device object
    const newDevice = {
      id: devices.length + 1,
      name: deviceName,
      signal: signalStrength,
      activatedOn: new Date().toLocaleDateString(),
      contacts: [],
      triggerWords: [],
    };

    // Add new device to the devices list
    setDevices([...devices, newDevice]);

    // Close the modal after adding
    setShowAddModal(false);
    alert(`Device ${deviceName} added successfully!`);
  } catch (error) {
    console.error("Error connecting to Bluetooth device", error);
    alert("Failed to add device via Bluetooth.");
  } finally {
    setLoading(false); // Stop signal animation (loading)
  }
};

const Device = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "MITR_01",
      signal: "Good",
      activatedOn: "04 Mar 2025",
      contacts: [
        { name: "Dad", phone: "+91 XXXXXXXX12", modes: "WhatsApp + SMS" },
        { name: "Mom", phone: "+91 XXXXXXXX34" },
        { name: "Friend", phone: "+91 XXXXXXXX56" },
      ],
      triggerWords: ["Help me", "Please stop"],
      tracking: false, // Tracking state
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false); // For showing the map

  const handleEdit = (device) => {
    setSelectedDevice(device);
    setShowEdit(true);
  };

  const handleClose = () => {
    setShowEdit(false);
    setSelectedDevice(null);
  };

  const handleAddDeviceModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddDeviceModal = () => {
    setShowAddModal(false);
  };

  const toggleTracking = (deviceId) => {
    setDevices(devices.map(device =>
      device.id === deviceId ? { ...device, tracking: !device.tracking } : device
    ));
  };

  const handleShowMap = () => {
    setShowMapModal(true);
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark">👋 Hello, Mitr</h4>
          <p className="text-muted">Your Linked Devices ({devices.length} Total)</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center" onClick={handleAddDeviceModal}>
          <FaPlus className="me-2" /> Add New Device
        </Button>
      </div>

      {devices.map((device) => (
        <Card key={device.id} className="mb-4 shadow-sm rounded-4">
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <h5 className="fw-bold mb-2">🛡️ Device Name: {device.name}</h5>
                <p className="mb-1">📶 <strong>Signal:</strong> {device.signal}</p>
                <p className="mb-1"><strong className="me-2"><FaMapMarkerAlt /> Tracking:</strong><button className="btn btn-outline-success me-2">Start Tracking</button><button className="btn btn-outline-danger">Stop Tracking</button></p>
                <p className="mb-1">📅 <strong>Activated On:</strong> {device.activatedOn}</p>
              </Col>
              <Col md={6}>
                <p className="mb-2 fw-bold">👤 Emergency Contacts ({device.contacts.length}):</p>
                <ListGroup className="mb-2">
                  {device.contacts.map((c, i) => (
                    <ListGroup.Item key={i}>
                      • {c.name} - {c.phone} {c.modes ? `(${c.modes})` : ""}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <p className="mb-3">🎯 <strong>Trigger Words:</strong> [{device.triggerWords.map(t => `"${t}"`).join(", ")}]</p>

                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" onClick={() => handleEdit(device)}><FaEdit /> Edit</Button>
                  <Button variant="outline-warning"><FaExclamationTriangle /> Test SOS</Button>
                  <Button variant="outline-danger"><FaUnlink /> Unlink</Button>
                  {/* Start/Stop Tracking Button */}
                  <Button
                    variant={device.tracking ? "success" : "outline-success"}
                    onClick={() => toggleTracking(device.id)}
                  >
                    {device.tracking ? "Stop Tracking" : "Start Tracking"}
                  </Button>
                  {/* Show Map Button */}
                  {device.tracking && (
                    <Button variant="outline-primary" onClick={handleShowMap}>
                      Show Tracked Map
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* Reusable Modal Component */}
      <EditDevice show={showEdit} onClose={handleClose} device={selectedDevice} />

      {/* Add Device Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddDeviceModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Device via Bluetooth</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>To add a new device via Bluetooth, ensure the device is nearby and ready for connection.</p>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
              <span className="ms-2">Searching for devices...</span>
            </div>
          ) : (
            <Button variant="outline-primary" onClick={() => addDeviceBluetooth(setDevices, devices, setShowAddModal, setLoading)}>
              <FaBluetooth className="me-2" /> Add Device
            </Button>
          )}
        </Modal.Body>
      </Modal>

      {/* Show Tracked Map Modal */}
      <Modal show={showMapModal} onHide={handleCloseMapModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tracked Device Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The map showing the tracked path will be displayed here.</p>
          {/* Placeholder for the actual map component */}
          {/* Integrate a map library like Google Maps, Leaflet, etc., to show the tracking path */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMapModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Device;
