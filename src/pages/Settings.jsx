import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword, updateUserInfo, changePassword, deleteAccount } from '../services/api';
import './settings.css';

function Settings() {
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [userInfo, setUserInfo] = useState({
    username: '',
    userID: '',
  });
  const [previousUserInfo, setPreviousUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('mitr-token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Load previous user info from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('mitr-user'));
    if (user) {
      setPreviousUserInfo({
        username: user.username || user.userID, // Fallback to userID if username is not set
        userID: user.userID,
      });
    }
  }, []);

  // Generate random color for avatar
  const getRandomColor = () => {
    const colors = ['#bb86fc', '#e040fb', '#ff4dda', '#6200ea', '#d81b60'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await changePassword(changePasswordData);
      setError('');
      setChangePasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email: forgotPasswordEmail });
      setError('');
      setForgotPasswordEmail('');
      alert('Password reset OTP sent to email');
      setShowResetPassword(true); // Show reset password form after OTP request
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await resetPassword(resetPasswordData);
      setError('');
      setResetPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
      setShowResetPassword(false);
      alert('Password reset successfully');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    }
  };

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserInfo(userInfo);
      // Update localStorage with new user info
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('mitr-user')),
        userID: userInfo.userID || previousUserInfo.userID,
        username: userInfo.username || previousUserInfo.username,
      };
      localStorage.setItem('mitr-user', JSON.stringify(updatedUser));
      setPreviousUserInfo({
        username: userInfo.username || previousUserInfo.username,
        userID: userInfo.userID || previousUserInfo.userID,
      });
      setError('');
      setUserInfo({ username: '', userID: '' });
      alert('User information updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update user information');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      localStorage.removeItem('mitr-token');
      localStorage.removeItem('mitr-user');
      setError('');
      alert('Account deleted successfully');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    }
  };

  return (
    <div className="settings-background">
      <div className="settings-overlay-glow" />
      <Container className="settings-container">
        <Card className="settings-card glass-effect animate-slide-up">
          <Card.Body>
            <h3 className="text-gradient">Settings</h3>
            {error && <div className="error-message">{error}</div>}

            {/* User Info Display */}
            {previousUserInfo && (
              <div className="user-info-display mb-4">
                <div
                  className="user-avatar"
                  style={{ backgroundColor: getRandomColor() }}
                  aria-label={`Avatar for ${previousUserInfo.username}`}
                >
                  {previousUserInfo.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="text-gradient">Current User Info</h5>
                  <p>
                    <strong>Username:</strong> {previousUserInfo.username}
                  </p>
                  <p>
                    <strong>User ID:</strong> {previousUserInfo.userID}
                  </p>
                </div>
              </div>
            )}

            {/* Update User Information */}
            <h4 className="text-gradient mt-4">Update User Information</h4>
            <Form onSubmit={handleUpdateUserInfo}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={userInfo.username}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, username: e.target.value })
                      }
                      placeholder="Enter new username"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={userInfo.userID}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, userID: e.target.value })
                      }
                      placeholder="Enter new user ID"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" className="neon-btn">
                Update User Info
              </Button>
            </Form>

            {/* Change Password */}
            <h4 className="text-gradient mt-4">Change Password</h4>
            <Form onSubmit={handleChangePassword}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={changePasswordData.currentPassword}
                      onChange={(e) =>
                        setChangePasswordData({
                          ...changePasswordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={changePasswordData.newPassword}
                      onChange={(e) =>
                        setChangePasswordData({
                          ...changePasswordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={changePasswordData.confirmPassword}
                      onChange={(e) =>
                        setChangePasswordData({
                          ...changePasswordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" className="neon-btn">
                Change Password
              </Button>
              <div className="text-center mt-3">
                <p className="text-light">
                  Forgot password?{' '}
                  <Link
                    to="#"
                    onClick={() => setShowResetPassword(true)}
                    className="auth-link"
                  >
                    Send Reset OTP
                  </Link>
                </p>
              </div>
            </Form>

            {/* Reset Password Form (shown after clicking Forgot Password) */}
            {showResetPassword && (
              <Form onSubmit={showResetPassword ? handleResetPassword : handleForgotPassword} className="mt-3">
                <h4 className="text-gradient mt-4">
                  {showResetPassword && !forgotPasswordEmail ? 'Reset Password' : 'Request OTP'}
                </h4>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </Form.Group>
                {showResetPassword && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>OTP</Form.Label>
                      <Form.Control
                        type="text"
                        value={resetPasswordData.otp}
                        onChange={(e) =>
                          setResetPasswordData({ ...resetPasswordData, otp: e.target.value })
                        }
                        placeholder="Enter OTP"
                      />
                    </Form.Group>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={resetPasswordData.newPassword}
                            onChange={(e) =>
                              setResetPasswordData({
                                ...resetPasswordData,
                                newPassword: e.target.value,
                              })
                            }
                            placeholder="Enter new password"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            value={resetPasswordData.confirmPassword}
                            onChange={(e) =>
                              setResetPasswordData({
                                ...resetPasswordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            placeholder="Confirm new password"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
                <Button type="submit" className="neon-btn">
                  {showResetPassword && !forgotPasswordEmail ? 'Reset Password' : 'Send OTP'}
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => {
                    setShowResetPassword(false);
                    setForgotPasswordEmail('');
                    setResetPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancel
                </Button>
              </Form>
            )}

            {/* Delete Account */}
            <h4 className="text-gradient mt-4">Delete Account</h4>
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              className="mt-2"
            >
              Delete Account
            </Button>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="delete-confirm-overlay">
                <div className="delete-confirm-box glass-effect">
                  <h5 className="text-gradient">Confirm Account Deletion</h5>
                  <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    className="me-2"
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Settings;