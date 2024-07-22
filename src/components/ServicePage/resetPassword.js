import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { resetPassword } from '../../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPasswordPage() {

  const navigate = useNavigate();
  const location = useLocation();
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    return re.test(password);
}


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      setResetToken(token);
    }
  }, [location]);

  async function handleResetPasswordClick() {
    if (!validatePassword(newPassword)) {
      console.log(newPassword)
      setError('Password must contain at least 8 characters, including uppercase and lowercase letters and numbers');
      setNewPassword('');
      setConfirmPassword('')
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }
    const response = await resetPassword(resetToken, newPassword)
    if (response) {
      navigate('/login')
    } else {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h1>Reset Password</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Control
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="mb-3"
          style={{ maxWidth: '250px' }}
        />
        <Form.Control
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          className="mb-3"
          style={{ maxWidth: '250px' }}
        />
        <Button variant="primary" onClick={handleResetPasswordClick}>
          Reset Password
        </Button>
      </div>
    </Container>
  );
}

export default ResetPasswordPage;
