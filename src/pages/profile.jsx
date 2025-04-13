import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Collapse, Modal } from 'react-bootstrap';
import Img from "../assets/product5.jpg";
const EditButton = ({ onClick, label }) => (
  <Button 
    variant="outline-secondary" 
    size="sm" 
    className="transition-all hover:shadow-lg hover:bg-secondary" 
    onClick={onClick}
  >
    {label}
  </Button>
);

const EditProfileCard = ({ user, showModal, setShowModal }) => {
  const [formData, setFormData] = useState({
    name: user.fullName,
    email: user.email,
    phone: user.phone,
  });
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(false);
  const [otp, setOtp] = useState({ email: '', phone: '' });
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle verification for email/phone change
    if (formData.email !== user.email || formData.phone !== user.phone) {
      setIsVerificationNeeded(true);
      setOtpSent(true); // Set OTP sent flag to true
    } else {
      // Update the profile without verification
      setShowModal(false);
      // Update logic can go here (e.g., API call)
    }
  };

  const handleVerificationSubmit = () => {
    // Logic to handle OTP verification for email/phone
    if (otp.email && otp.phone) {
      setIsVerificationNeeded(false);
      setShowModal(false);
      // OTP verification logic can go here (e.g., API call to verify OTP)
    } else {
      alert("Please enter OTP for both email and phone.");
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="success" type="submit">
              Save Changes
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>

      {isVerificationNeeded && (
        <Modal.Footer>
          <div>
            <p className="text-muted">
              OTP has been sent to your email and phone. Please enter the OTP
              below to verify your changes.
            </p>
            
            {/* OTP for Email */}
            <Form.Group className="mb-3">
              <Form.Label>OTP for Email</Form.Label>
              <Form.Control
                type="text"
                value={otp.email}
                onChange={(e) => setOtp({ ...otp, email: e.target.value })}
                placeholder="Enter OTP sent to your email"
              />
            </Form.Group>

            {/* OTP for Phone */}
            <Form.Group className="mb-3">
              <Form.Label>OTP for Phone</Form.Label>
              <Form.Control
                type="text"
                value={otp.phone}
                onChange={(e) => setOtp({ ...otp, phone: e.target.value })}
                placeholder="Enter OTP sent to your phone"
              />
            </Form.Group>

            <Button variant="primary" onClick={handleVerificationSubmit}>
              Verify and Save Changes
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

const user = {
  fullName: 'Mitr User',
  userId: 'MITR123456',
  email: 'user@example.com',
  phone: '+91 9876543210',
  createdAt: 'March 1, 2025',
  lastUpdated: 'April 10, 2025',
};

const ChangePasswordSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <Card className="mb-4 shadow-sm rounded-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">🔐 Security</h5>
        <h6 className='fw-semibold mb-3 text-dark'>Change Account Password:</h6>
        {!showForm && (
          <Button variant="outline-primary" onClick={() => setShowForm(true)}>
            Change Password
          </Button>
        )}

        <Collapse in={showForm}>
          <div>
            <h6 className="fw-semibold mt-3 mb-3 text-dark">Change Your Profile Password</h6>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Old Password</Form.Label>
                <Form.Control type="password" placeholder="Enter old password" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="Enter new password" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm new password" />
              </Form.Group>

              <div className="d-flex flex-wrap gap-2">
                <Button variant="success">Update Password</Button>
                <Button variant="outline-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>

              <div className="mt-3">
                <Button
                  variant="link"
                  className="text-decoration-none p-0"
                  onClick={() => setShowForgot((prev) => !prev)}
                >
                  Forgot Password?
                </Button>
              </div>
            </Form>
          </div>
        </Collapse>

        <Collapse in={showForgot}>
          <div className="mt-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter your registered email" />
              </Form.Group>
              <Button variant="outline-primary">Send Verification Link</Button>
            </Form>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

const MyProfile = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Container className="py-4">
      <h3 className="fw-bold text-dark mb-4">👤 My Profile</h3>

      {/* Profile Overview */}
      <Card className="mb-4 shadow-sm rounded-4 border-0 transition-all">
        <Card.Body className="px-4 py-4">
          <Row className="align-items-center">
            {/* Profile Image Section */}
            <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
              <img
                src={Img}
                alt="Profile"
                className="img-fluid rounded-circle shadow-lg transition-transform hover:scale-105"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />
              <div className="d-grid gap-2 mt-3">
                <Button variant="outline-primary" size="sm">
                  Change Photo
                </Button>
                <EditButton 
                  label="Edit Profile" 
                  onClick={() => setShowModal(true)} 
                />
              </div>
            </Col>

            {/* Profile Data Section */}
            <Col xs={12} md={9}>
              <div className="d-flex flex-column ms-5">
                <div className="d-flex mb-2 w-100">
                  <div style={{ flex: '0 0 30%' }}>
                    <label className="text-bold">Name:</label>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-dark"><strong>{user.fullName}</strong></p>
                  </div>
                </div>

                {/* User ID Row */}
                <div className="d-flex mb-2 w-100">
                  <div style={{ flex: '0 0 30%' }}>
                    <label className="text-muted">User ID:</label>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-dark"><strong>{user.userId}</strong></p>
                  </div>
                </div>

                {/* Email Row */}
                <div className="d-flex mb-2 w-100">
                  <div style={{ flex: '0 0 30%' }}>
                    <label className="text-muted">Email:</label>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-dark">{user.email}</p>
                  </div>
                </div>

                {/* Phone Row */}
                <div className="d-flex mb-2 w-100">
                  <div style={{ flex: '0 0 30%' }}>
                    <label className="text-muted">Phone:</label>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-dark">{user.phone}</p>
                  </div>
                </div>

                {/* Account Created Row */}
                <div className="d-flex mb-2 w-100 text-muted small">
                  <div style={{ flex: '0 0 30%' }}>
                    <label className="text-muted">Account Created:</label>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-dark">{user.createdAt}</p>
                  </div>
                </div>

                {/* Last Updated Row */}
                <div className="d-flex mb-2 w-100 text-muted small">
                  <div style={{ flex: '0 0 30%' }}>
                    <label className="text-muted">Last Updated:</label>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="text-dark">{user.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Change Password Section */}
      <ChangePasswordSection />

      {/* Quick Actions */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <h5 className="fw-bold mb-3">⚡ Quick Actions</h5>
          <div className="d-flex flex-column flex-md-row gap-3">
            <Button variant="outline-secondary" className="w-100">Logout</Button>
            <Button variant="outline-danger" className="w-100">Delete Account</Button>
            <Button variant="outline-primary" className="w-100">Contact Support</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileCard 
        user={user} 
        showModal={showModal} 
        setShowModal={setShowModal} 
      />
    </Container>
  );
};

export default MyProfile;
