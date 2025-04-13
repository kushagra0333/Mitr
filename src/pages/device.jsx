
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
const RegisterDeviceModal = ({ show, onHide, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between registering and connecting
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to connect an already registered device
  const handleConnectDevice = async () => {
    const { id, password } = formData;
    if (!id || !password) {
      alert("Please fill in all fields.");
      return;
    }
    
    // Backend logic for connecting to an existing device
    try {
      // Call the backend API to connect the device
      const response = await fetch('/api/connectDevice', {
        method: 'POST',
        body: JSON.stringify({ id, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();

      if (response.ok) {
        alert("Device connected successfully.");
        onRegister(result, false); // Pass the result and indicate no registration
        setFormData({ id: "", password: "", confirmPassword: "" });
        onHide();
      } else {
        alert(result.message || "Failed to connect device.");
      }
    } catch (error) {
      alert("An error occurred while connecting the device.");
    }
  };

  // Function to register a new device
  const handleRegisterDevice = async () => {
    const { id, password, confirmPassword } = formData;
    if (!id || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Backend logic for registering a new device
    try {
      // Call the backend API to register the device
      const response = await fetch('/api/registerDevice', {
        method: 'POST',
        body: JSON.stringify({ id, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();

      if (response.ok) {
        alert("Device registered successfully.");
        onRegister(result, true); // Pass the result and indicate new registration
        setFormData({ id: "", password: "", confirmPassword: "" });
        onHide();
      } else {
        alert(result.message || "Failed to register device.");
      }
    } catch (error) {
      alert("An error occurred while registering the device.");
    }
  };

  const handleSubmit = () => {
    if (isRegistering) {
      handleRegisterDevice();
    } else {
      handleConnectDevice();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isRegistering ? "Register New Device" : "Connect Existing Device"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Device ID</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="Enter Device ID"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
            />
          </Form.Group>
          {isRegistering && (
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isRegistering ? "Register & Link" : "Connect"}
        </Button>
      </Modal.Footer>
      <Modal.Footer>
        <Button variant="link" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already registered? Connect instead." : "Need to register a new device?"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


const Device = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "MITR_01",
      activatedOn: "04 Mar 2025",
      contacts: [
        { name: "Dad", phone: "+91 XXXXXXXX12", modes: "WhatsApp + SMS" },
        { name: "Mom", phone: "+91 XXXXXXXX34", modes: "WhatsApp" },
        { name: "Friend", phone: "+91 XXXXXXXX56", modes: "SMS" },
      ],
      triggerWords: ["Help me", "Please stop"],
      tracking: false, // Tracking state
    },
    {
      id: 2,
      name: "MITR_02",
      activatedOn: "01 Apr 2025",
      contacts: [
        { name: "John", phone: "+1 555-1234", modes: "WhatsApp" },
        { name: "Alice", phone: "+1 555-5678", modes: "SMS" },
      ],
      triggerWords: ["Emergency", "Call 911"],
      tracking: true, // Tracking state
    },
  ]);
  const [showAddModal, setShowAddModal] = useState(false); // state to show the register device modal

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

  const handleRegisterDevice = (formData) => {
    console.log("Registered Device:", formData);
    // Logic for registering the device goes here
    setShowAddModal(false); // Close the modal after registering
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col xs={12} md={8} className="mb-2 mb-md-0">
          <h4 className="fw-bold text-dark">👋 Hello, Mitr</h4>
          <p className="text-muted">Your Linked Devices ({devices.length} Total)</p>
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          <Button
            variant="primary"
            className="w-100 w-md-auto d-flex align-items-center justify-content-center"
            onClick={handleAddDeviceModal}
          >
            <FaPlus className="me-2" /> Add Device
          </Button>
        </Col>
      </Row>

      {devices.map((device) => (
        <Card key={device.id} className="mb-4 shadow-sm rounded-4">
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <h5 className="fw-bold mb-2">🛡️ Device Name: {device.name}</h5>
                <div className="mb-3">
                  <div className="mb-2"><strong><FaMapMarkerAlt /> Tracking:</strong></div>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    {device.tracking ? (
                      <button className="btn btn-outline-danger">Stop Tracking</button>
                    ) : (
                      <button className="btn btn-outline-success">Start Tracking</button>
                    )}
                    <button className="btn btn-outline-primary">View Tracking</button>
                  </div>
                </div>
                <p className="mb-1">📅 <strong>Activated On:</strong> {device.activatedOn}</p>
                <p className="mb-1"><button className="btn btn-outline-primary">Connect device</button></p>
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
                  <Button variant="outline-danger"><FaUnlink /> Remove device</Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* Register Device Modal */}
      <RegisterDeviceModal
        show={showAddModal}
        onHide={handleCloseAddDeviceModal}
        onRegister={handleRegisterDevice}
      />

      {/* Edit Device Modal */}
      <EditDevice show={showEdit} onClose={handleClose} device={selectedDevice} />
    </Container>
  );
};

export default Device;
