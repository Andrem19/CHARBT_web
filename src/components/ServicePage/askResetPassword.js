import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Toast } from 'react-bootstrap';
import { requestResetPassword } from '../../api/auth';

function RequestResetPasswordPage() {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastBody, setToastBody] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async function handleRequestResetClick() {
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      setEmail('');
      return;
    }
    const response = await requestResetPassword(email)
    if (response.message === 'Please check your email for a password reset link') {
      setToastBody(response.message);
      setShowToast(true);
    } else {
      setError(response.message);
    }
  };
  

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 7000);
  
      return () => {
        clearTimeout(timer);
      };
    }
  }, [showToast]);

  return (
    <div>
      <div style={{
        position: 'fixed', 
        top: 0, 
        left: '50%', 
        transform: 'translate(-50%, 0)',
        zIndex: 9999
      }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} style={{backgroundColor: '#ffc107', color: 'black'}}>
          <Toast.Header closeButton={false} style={{backgroundColor: '#ff9800', color: 'white'}}>
            <strong className="mr-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastBody}</Toast.Body>
        </Toast>
      </div>
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <h1>Reset Password</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Control
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-3"
            style={{ maxWidth: '250px' }}
          />
          <Button variant="primary" onClick={handleRequestResetClick}>
            Request Password Reset
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default RequestResetPasswordPage;
