import React ,{useState} from 'react';
import { Container, Row, Col, Card, Button, Form, Collapse  } from 'react-bootstrap';
import Img from "../assets/product 4.avif"
const ChangePasswordSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <Card className="mb-4 shadow-sm rounded-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">🔐 Security</h5>

        {!showForm && (
          <Button variant="outline-primary" onClick={() => setShowForm(true)}>
            Change Password
          </Button>
        )}

        <Collapse in={showForm}>
          <div>
            <Form className="mt-3">
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

              <div className="d-flex gap-2">
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
  const user = {
    fullName: 'Mitr User',
    userId: 'MITR123456',
    email: 'user@example.com',
    phone: '+91 9876543210',
    createdAt: 'March 1, 2025',
    lastUpdated: 'April 10, 2025',
  };

  return (
    <Container className="py-4">
      <h3 className="fw-bold text-dark mb-4">👤 My Profile</h3>

      {/* Profile Overview */}
<Card className="mb-4 shadow-sm rounded-4">
  <Card.Body>
    <Row className="align-items-center">
      <Col md={3} className="text-center mb-3 mb-md-0">
        <img
          src={Img}
          alt="Profile"
          className="img-fluid rounded-circle"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
        <div className="d-grid gap-2 mt-2">
          <Button variant="outline-primary" size="sm">
            Change Photo
          </Button>
          <Button variant="outline-secondary" size="sm">
            Edit Profile
          </Button>
        </div>
      </Col>

      <Col md={9}>
        <h5 className="fw-bold mb-1">{user.fullName}</h5>
        <p className="text-muted mb-1">
          User ID: <strong>{user.userId}</strong>
        </p>
        <p className="mb-1">📧 {user.email}</p>
        <p>📞 {user.phone}</p>
      </Col>
    </Row>
  </Card.Body>
</Card>

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
    </Container>
  );
};

export default MyProfile;
