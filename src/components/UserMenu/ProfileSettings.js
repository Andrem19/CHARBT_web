import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Tab, Button, Container, Dropdown, DropdownButton, Spinner, Row, Col, Form, Modal, Image, Card } from 'react-bootstrap';
import { changeName, uploadAvatar, deleteUser, deleteAvatar, changeEmail, changePassword, createTicket } from '../../api/auth';
import { cancelSubscription } from '../../api/payment';
import { setMsg, reloadUser } from '../../redux/userActions';
import { validateUsername, validateEmail, validatePassword } from '../../services/services';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useLocation, Redirect } from 'react-router-dom';


function ProfileSettings() {

  const location = useLocation();
  const [activeKey, setActiveKey] = useState('');
  const jwt = localStorage.getItem('jwt');
  const navigate = useNavigate()

  useEffect(() => {
    if (!jwt) {
      navigate('/login');
    }
  }, [jwt, navigate]);

  const onTabChange = (key) => {
    setActiveKey(key);
  };
  useEffect(() => {
  switch(location.pathname) {
    case '/profile_settings':
      setActiveKey('profile');
      break;
    case '/billing_settings':
      setActiveKey('subscription');
      break;
    case '/support':
      setActiveKey('support');
      break;
    default:
      setActiveKey('profile');
  }
}, [location]);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const theme = useSelector((state) => state.data.theme);
  
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [newName, setNewName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)
  const fileInput = useRef(null);

  const handleDeleteAccount = async () => {
    const response = await deleteUser(navigate)
    dispatch(setMsg(response))
    setShowModal(false)
  };

  const handleUploadAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        console.log('No file selected');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const message = await uploadAvatar(navigate, formData);
    dispatch(setMsg(message))
    dispatch(reloadUser(navigate))
    
};

  const handleDeleteAvatar = async () => {
    const response = await deleteAvatar(navigate)
    dispatch(setMsg(response))
    dispatch(reloadUser(navigate))
  };
  const onChangeUsernameHendler = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeName = async () => {
    if (!validateUsername(newName)) {
        dispatch(setMsg('Username should not exceed 30 characters'));
        setNewName('');
        return;
      }
    const responseMsg = await changeName(navigate, user.id, newName)
    dispatch(setMsg(responseMsg));
    dispatch(reloadUser(navigate))
    setNewName('');
  };
  const handleChangeEmail = async () => {
    if (!validateEmail(email)) {
        dispatch(setMsg('Please enter a valid email'));
        setEmail('');
        return;
      }

    const response = await changeEmail(navigate, currentPassword, email)
    dispatch(setMsg(response))
    setShowModal2(false)
    await new Promise(resolve => setTimeout(resolve, 4000));
    if (response === 'Confirm your new email and log in') {
        window.localStorage.removeItem('jwt')
        dispatch({ type: 'RESET_USER' });
        navigate('/login');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
        dispatch(setMsg('Passwords do not match'));
        setConfirmPassword('');
        setNewPassword('')
        return;
      }
      if (!validatePassword(newPassword)) {
        dispatch(setMsg('Password must contain at least 8 characters, including uppercase and lowercase letters and numbers'));
        setConfirmPassword('');
        setNewPassword('')
        return;
      }

    const response = await changePassword(navigate, currentPassword, newPassword)
    dispatch(setMsg(response))
    await new Promise(resolve => setTimeout(resolve, 4000));
    if (response === 'Password successfully changed') {
        window.localStorage.removeItem('jwt')
        dispatch({ type: 'RESET_USER' });
        navigate('/login');
    }
  };

  const changeCancelPlan = () => {
    if (user.payment_status.toUpperCase() === 'DEFAULT' || user.subscription_to !== 0 ) {
      navigate('/pricing')
    } else {
      setShowModal3(true)
    }
  }
  const handleCancelSubscription = async () => {
    const response = await cancelSubscription(navigate)
    dispatch(setMsg(response))
    setShowModal3(false)
  }

  const handleSubjectChange = (event) => {
    if (event.target.value.length <= 40) {
      setSubject(event.target.value);
    }
  };

  const handleMessageChange = (event) => {
    if (event.target.value.length <= 300) {
      setMessage(event.target.value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true)
    const response = await createTicket(navigate, subject, message)
    dispatch(setMsg(response))
    setMessage('')
    setSubject('')
    setLoading(false)
  };

  return jwt ? (
    user === null ? 
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div> :
    <Container style={{ padding: '1rem', backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black' }}>
      <h1 style={{marginBottom: 20}}>{user.email}</h1>
      <p>Joined {user.registration_date ? formatDistanceToNow(user.registration_date * 1000) : '99 years'} ago</p>
      <Tabs activeKey={activeKey} onSelect={onTabChange}>
        <Tab eventKey="profile" title="Profile">
        <br/>
          <Row style={{ marginBottom: 20 }}>
            <Col md={4}>
              <Form.Group controlId="formUsername">
                <Form.Label style={{ fontSize: 20 }}>Username:</Form.Label>
                <Form.Control onChange={(e) => onChangeUsernameHendler(e)} type="text" placeholder={user.username} />
                <p>You have {3-user.name_changed} username changes left (you can change your username 3 times in total)</p>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant="outline-primary" onClick={handleChangeName} style={{ marginTop: '37px' }}>Change</Button>
            </Col>
          </Row>
          <br/>
          <Row style={{ marginBottom: 20 }}>
            <Col md={2}>
            <Form.Label style={{ fontSize: 20, marginBottom: 10 }} >Avatar:</Form.Label>
              <Form.Group controlId="formAvatar">
                <Image src={user.avatarLink || "placeholder_avatar.jpg"} roundedCircle style={{ width: 120, height: 120 }} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <p style={{ fontSize: 14, marginTop: 30 }} >
                JPG, GIF, PNG. Max size 600KB
                </p>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Button variant="outline-success" onClick={() => fileInput.current.click()} style={{ marginTop: '10px' }}>Upload Avatar</Button>
                <input ref={fileInput} type="file" hidden onChange={handleUploadAvatar} />
                <Button variant="outline-warning" onClick={handleDeleteAvatar} style={{ marginTop: '10px' }}>Delete Avatar</Button>
              </div>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col md={4}>
                <div style={{ fontSize: 20, marginBottom: 10 }}>Delete:</div>
                <Button variant="outline-danger" onClick={() => setShowModal(true)}>Delete Account</Button>
            </Col>
          </Row>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Account</Modal.Title>
            </Modal.Header>
            <Modal.Body >If you encounter any difficulties that our team could help you solve, write to us from the email to which your account is registered to <b>support@charbt.com</b><br/><br/>Here you can delete your account. If you click on the delete button and if you do not have paid subscription plans, then after 30 days, if you have not visited the resource for 30 days (30 days from your last login) your account, along with all data that may be associated with it, will be permanently deleted. If you have an active paid subscription but still want to delete your account, you must first cancel your subscription. Are you sure you want to delete your account?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                Yes, I want to delete my account
              </Button>
            </Modal.Footer>
          </Modal>
        </Tab>
        <Tab eventKey="security" title="Security">
        <br/>
        
        <Row style={{ marginBottom: 20 }}>
            <Col md={4}>
              <Form.Group controlId="formCurrentPassword">
                <Form.Control type="password" placeholder="Current Password" onChange={e => setCurrentPassword(e.target.value)} />
                <p style={{ fontSize: 12 }}>To change email or password you need to input your current password</p>
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 25 }}>Change Email:</p>
            <Col md={4}>
              <Form.Group controlId="formEmail">
                <Form.Control type="email" placeholder={user.email} onChange={e => setEmail(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant="outline-primary" onClick={() => setShowModal2(true)} style={{ width: '200px' }} >Change Email</Button>
            </Col>
          </Row>
          <br/>
          <p style={{ fontSize: 25 }}>Change Password:</p>
          <Row style={{ marginBottom: 20 }}>
            <Col md={4}>
              <Form.Group controlId="formNewPassword">
                <Form.Control type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
          <Col md={4}>
              <Form.Group controlId="formConfirmPassword">
                <Form.Control type="password" placeholder="Confirm New Password" onChange={e => setConfirmPassword(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant="outline-primary" onClick={handleChangePassword} style={{ width: '200px' }}>Change Password</Button>
            </Col>
          </Row>

        <Modal show={showModal2} onHide={() => setShowModal2(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to change your email? You will need to confirm your new email by clicking on the link in the email.
          </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal2(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={handleChangeEmail}>
                Yes, send me a link
            </Button>
        </Modal.Footer>
</Modal>


        </Tab>
        <Tab eventKey="subscription" title="Subscription">
          <br/>
          <Row style={{ marginBottom: 20 }}>
            <Col>
              <Form.Group controlId="currentPlan">
                <p>Current plan:</p>
                <Card style={{backgroundColor: 'grey'}}>
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={8}>
                        {`${user.payment_status.toUpperCase() === 'DEFAULT' || user.subscription_to !== 0 ? 'You have no plan' : user.payment_status.toUpperCase() }`}
                      </Col>
                      <Col xs={4} className="d-flex justify-content-end">
                        <Button variant="success" onClick={changeCancelPlan}>
                          {user.payment_status.toUpperCase() === 'DEFAULT' || user.subscription_to !== 0 ? 'Change plan' : 'Cancel subscription' }
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Form.Group>
            </Col>
          </Row>

          <Modal show={showModal3} onHide={() => setShowModal3(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Subscription</Modal.Title>
          </Modal.Header>
          <Modal.Body>If you cancel your subscription, you will no longer be charged for subsequent periods. Also, your subscription will remain active until the end of the period for which you have already paid. <br/><br/>Are you sure you want to cancel your subscription?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal3(false)}>
              No, keep my subscription
            </Button>
            <Button variant="danger" onClick={handleCancelSubscription}>
              Yes, cancel my subscription
            </Button>
          </Modal.Footer>
        </Modal>
        </Tab>

        <Tab eventKey="support" title="Support">
        {loading ? 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
        : 
      <Form style={{ width: '50%', marginLeft: 15, marginTop: 10}}>
        <Form.Group controlId="supportForm.Subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control type="text" value={subject} onChange={handleSubjectChange} />
        </Form.Group>
        <Form.Group controlId="supportForm.Message">
          <Form.Label>Message ({300 - message.length} characters remaining)</Form.Label>
          <Form.Control as="textarea" rows={3} value={message} onChange={handleMessageChange} />
        </Form.Group>
        <Button style={{marginTop: 10}} variant="primary" onClick={handleSubmit}>
          Create Ticket
        </Button>
      </Form>}
    </Tab>
      </Tabs>
    </Container>
  ) : null;
}

export default ProfileSettings;