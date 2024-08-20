import React, { useState, useCallback, useEffect } from 'react';
import { Container, Form, Button, Alert, Toast } from 'react-bootstrap';
import { checkUserExist, registerUser} from '../../api/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, reloadUser } from '../../redux/userActions';
import Modal from '../ServicePage/modalText';
import { getText } from '../../api/data';
import { validateUsername, validateEmail, validatePassword } from '../../services/services';

function SignInSignUpPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const errorState = useSelector((state) => state.user.error);
  const errorCount = useSelector((state) => state.user.errorCount);
  const user = useSelector((state) => state.user.user);
  const theme = useSelector(state => state.data.theme);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isUserExist, setIsUserExist] = useState(null);
  const [error, setError] = useState('');
  const [tostBody, setTostBody] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDate, setModalDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailVerified = queryParams.get('emailVerified');
  const refCode = queryParams.get('ref');
  const [referralCode, setReferralCode] = useState(refCode || '');

  const handleLinkClick = async (name_id) => {
    const data = await getText(name_id);
    setModalContent(data.text);
    setModalTitle(data.name);
    setModalDate(data.date);
    setIsModalOpen(true);
  }

  const handleCloseToast = () => setShowToast(false);


  async function handleNextClick() {
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      setEmail('');
      return;
    }
    const userExists = await checkUserExist(email)
    setIsUserExist(userExists);
  };

  async function handleLoginClick() {
    dispatch(loginUser(email, password, navigate));
  };

  useEffect(() => {
    if (user) {
      navigate('/trading')
    } else if (errorCount) {
      setPassword('');
    }
  }, [user, errorCount]);

  async function handleSignUpClick() {
    if (!username) {
      setError('Username cannot be empty');
      return;
    }
    if (!validateUsername(username)) {
      setError('Username should not exceed 30 characters');
      setUsername('');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must contain at least 8 characters, including uppercase and lowercase letters and numbers');
      setPassword('');
      setConfirmPassword('')
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setPassword('');
      setConfirmPassword('');
      return;
    }
    const response = await registerUser(username, email, password, referralCode)
    if (response) {
      setIsUserExist(true);
      navigate('/email_confirmation')
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    if (errorState) {
      setTostBody(errorState)
      setShowToast(true);
    }
    if (emailVerified) {
      setTostBody('Your email has been successfully verified. Please log in using your credentials.')
      setShowToast(true);
    }
  }, [errorCount, emailVerified ]);

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
      
      <Toast show={showToast} onClose={handleCloseToast} style={{backgroundColor: '#ffc107', color: 'black'}}>
        <Toast.Header closeButton={false} style={{backgroundColor: '#ff9800', color: 'white'}}>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>{tostBody}</Toast.Body>
      </Toast>
        </div>
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
    
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h1>{isUserExist === null ? 'Welcome to us' : isUserExist ? 'Login' : 'Sign Up'}</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {isUserExist === null ? (
          <>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="mb-3"
              style={{ maxWidth: '250px' }}
            />
              <Button variant="primary" onClick={handleNextClick}>
                Next
              </Button>
          </>
        ) : isUserExist ? (
          <>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              disabled
              className="mb-3"
              style={{ maxWidth: '250px' }}
            />
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-3"
              style={{ maxWidth: '250px' }}
            />
            <Button variant="primary" onClick={handleLoginClick}>
              Login
            </Button>
            <p className="mt-3">
              <a href="/req_reset_password" style={{ textDecoration: 'none', color: '#007bff' }}>Forgot Password?</a>
            </p>
          </>
        ) : (
          <>
            <Form.Control
              type="text"
              value={referralCode}
              onChange={e => setReferralCode(e.target.value)}
              placeholder="Referral Code (optional)"
              className="mb-3"
              style={{ maxWidth: '250px' }}
            />
            <Form.Control
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="mb-3"
              style={{ maxWidth: '250px' }}
            />
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              disabled
              className="mb-3"
              style={{ maxWidth: '250px' }}
            />
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-3"
              style={{ maxWidth: '250px' }}
            />
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="mb-3"
              style={{ maxWidth: '250px' }}
            />
            <Form.Check 
              type="checkbox"
              style={{ display: 'flex', alignItems: 'flex-start' }}
              label={
                <span>
                  I have read and agree to CharBt <br />
                  <span 
                    style={{textDecoration: 'underline', fontWeight: 'bold', color: theme == 'dark'? 'white' : 'blue', cursor: 'pointer'}} 
                    onClick={() => handleLinkClick('terms_of_service')}
                  >
                    Terms of Use
                  </span> 
                  {' and '}
                  <span 
                    style={{textDecoration: 'underline', fontWeight: 'bold', color: theme == 'dark'? 'white' : 'blue', cursor: 'pointer'}} 
                    onClick={() => handleLinkClick('privacy_policy')}
                  >
                    Privacy Policy
                  </span>.
                </span>
              }
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <Button variant="primary" onClick={handleSignUpClick} disabled={!termsAccepted}>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </Container>
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} content={modalContent} acceptTerms={false} date={modalDate} />
    </div>
  );
}

export default SignInSignUpPage;
