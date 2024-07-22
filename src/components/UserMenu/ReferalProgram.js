import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Button, Container, Dropdown, DropdownButton, Spinner, Row, Col, Form, Modal } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';
import { WEB_URL } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Card from 'react-bootstrap/Card';
import { getPaymentPlans } from '../../api/payment';
import { setPaymentPlans } from '../../redux/dataActions';
import { purchasePlan, transferTokens } from '../../api/payment';
import { setMsg, reloadUser } from '../../redux/userActions';

const ReferralPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const jwt = localStorage.getItem('jwt');
  

  useEffect(() => {
    if (!jwt) {
      navigate('/login');
    }
  }, [jwt, navigate]);
  const user = useSelector(state => state.user.user);
  const theme = useSelector((state) => state.data.theme);
  const payment_plans_state = useSelector(state => state.data.payment_plans);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState('Essential');
  const [selectedDays, setSelectedDays] = useState(1);
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getPlans = async () => {
      const payment_plans = await getPaymentPlans()
      console.log('payment plan', payment_plans)
      await dispatch(setPaymentPlans(payment_plans));
    };
    if (!payment_plans_state) {
      getPlans()
    }
  }, []);

  const handleSend = () => {
    setShowModal(true);
  };
  
  const handleConfirm = async () => {
    const responseMsg = await transferTokens(navigate, amount, receiver)
    dispatch(setMsg(responseMsg))
    setReceiver('')
    setAmount('')
    setShowModal(false);
    dispatch(reloadUser(navigate));
  };
  
  const handleClose = () => {
    setShowModal(false);
  };

  const handleBuy = async () => {
    const responseMsg = await purchasePlan(navigate, selectedPlan, selectedDays)
    dispatch(setMsg(responseMsg))
    dispatch(reloadUser(navigate));
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${WEB_URL}?ref=${user.refcode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Сбросить состояние через 2 секунды
  };
  const copyToClipboardCode = () => {
    navigator.clipboard.writeText(`${user.refcode}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000); // Сбросить состояние через 2 секунды
  };

  return jwt ? (
    payment_plans_state === null || user === null ? 
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div> :
    <Container style={{ padding: '1rem', backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black' }}>
      <h1 style={{marginBottom: 20}}>Tokens: {user.tokens}</h1>
      <Tabs defaultActiveKey="link">
        <Tab eventKey="link" title="Link">
          <p style={{fontSize: 30, marginLeft: 25, marginRight: 25}}>For each invited user who makes a payment on the site, you will receive 10 tokens, which you can later spend on our subscription plans.</p>
          <p style={{ fontSize: 24, marginLeft: 25, marginRight: 25 }}>*Your referral, invited through your referral link, will also receive 10 tokens upon registration.</p>
          <div style={{ backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', padding: '1rem', marginBottom: '1rem' }}>
          <p>Your Referal Link:</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Card style={{backgroundColor: 'grey'}}>
              <Card.Body>{`${WEB_URL}/login?ref=${user.refcode}`}</Card.Body>
            </Card>
            <FontAwesomeIcon style={{ fontSize: 30, marginLeft: '1rem', cursor: 'pointer' }} icon={faCopy} onClick={copyToClipboard}/> {copied && <p style={{ color: 'green', marginLeft: 15 }}>Link Copied!</p>}
          </div>
          
          <p style={{ marginTop: 15 }}>Your Referal Code:</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Card style={{backgroundColor: 'grey'}}>
              <Card.Body>{`${user.refcode}`}</Card.Body>
            </Card>
            <FontAwesomeIcon style={{ fontSize: 30, marginLeft: '1rem', cursor: 'pointer' }} icon={faCopy} onClick={copyToClipboardCode}/> {copiedCode && <p style={{ color: 'green', marginLeft: 15 }}>Code Copied!</p>}
          </div>
          
          </div>
          <SocialIcon style={{ margin: 10 }} url={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${WEB_URL}?ref=${user.refcode}`)}`} />
          <SocialIcon style={{ margin: 10 }} url={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${WEB_URL}?ref=${user.refcode}`)}`} />
          <SocialIcon style={{ margin: 10 }} url={`mailto:?subject=Check out this website&body=${encodeURIComponent(`${WEB_URL}?ref=${user.refcode}`)}`} />
        </Tab>
        <Tab eventKey="redeem" title="Redeem">
          <p style={{fontSize: 30, marginLeft: 25, marginRight: 25}} >You can spend your tokens on one of the subscription packages.</p>
          <p style={{marginLeft: 25, marginRight: 25}} >*You can use tokens subscription only if you dont have subscription plan. (your status is DEFAULT)</p>
          <div style={{margin: 25, marginLeft: 25, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <DropdownButton id="dropdown-basic-button" title={selectedPlan}>
              {Object.values(payment_plans_state).map((plan) => (
                <Dropdown.Item onClick={() => setSelectedPlan(plan.name)}>{plan.name}</Dropdown.Item>
              ))}
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title={`${selectedDays} day${selectedDays > 1 ? 's' : ''}`}>
              {[1, 2, 3, 4, 5].map((day) => (
                <Dropdown.Item onClick={() => setSelectedDays(day)}>{`${day} day${day > 1 ? 's' : ''}`}</Dropdown.Item>
              ))}
            </DropdownButton> {payment_plans_state[selectedPlan].token_price_day * selectedDays} tokens
            <Button onClick={handleBuy} variant="primary">Buy</Button>
          </div>
        </Tab>
        <Tab eventKey="send" title="Send">
        <p style={{fontSize: 30, marginLeft: 25, marginRight: 25}} >You can send your tokens to another user.</p>
        <Row style={{marginLeft: 15}}>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="Receiver (Referal Code)"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </Col>
          <Col md={3}>
            <Button variant="primary" onClick={handleSend}>Send</Button>
          </Col>
        </Row>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to send {amount} tokens to user {receiver}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        </Tab>
      </Tabs>
      
    </Container>
  ) : null
};

export default ReferralPage;
