import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, ListGroupItem, Form, Tooltip, OverlayTrigger, Spinner, ProgressBar } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { PayButton } from './PayButton';
import { getPaymentPlans } from '../../api/payment';
import { setPaymentPlans } from '../../redux/dataActions';
import AvatarWithBadge from '../NavBar/Avatar';
import './styles.css'


function Pricing() {

  const dispatch = useDispatch();
  const [isMonthly, setIsMonthly] = useState(false);
  const theme = useSelector((state) => state.data.theme);
  const isMobile = useSelector(state => state.user.isMobile);
  const payment_plans_state = useSelector(state => state.data.payment_plans);

  const timeframes = ['1 Day Timeframe', '1 Hour Timeframe', '30 Minute Timeframe', '5 Minute Timeframe', '1 Minute Timeframe', 'Auxiliary Timeframe', 'Detailed statistics', 'Saving session data in csv', 'Voting in polls', 'Personal dataset'];

  const getHeaderStyle = (planName) => {
    switch (planName) {
      case 'Essential':
        return { fontSize: '2em', fontWeight: 'bold', color: 'rgb(46, 46, 46)' };
      case 'Premium':
        return { fontSize: '2em', fontWeight: 'bold', background: 'linear-gradient(to right, yellow, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
      case 'Premium-Plus':
        return { fontSize: '2em', fontWeight: 'bold', background: 'linear-gradient(to right, red, blue)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
      default:
        return { fontSize: '2em', fontWeight: 'bold' };
    }
  };

  useEffect(() => {
    const getPlans = async () => {
      const payment_plans = await getPaymentPlans()
      await dispatch(setPaymentPlans(payment_plans));
    };
    if (!payment_plans_state) {
      getPlans()
    }
  }, []);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  return (
    payment_plans_state == null ? 
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div> :
    <div className={` ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
    <Container>
      <h1 className="text-center mb-4">Join us with one of our plans</h1>

      <div className="d-flex justify-content-center mb-5 align-items-center">
        <div style={{ marginRight: '10px', padding: '10px', backgroundColor: theme === 'light' ? '#dee2e6' : '#343a40', borderRadius: '5px', fontSize: isMobile ? '0.8em' : '1em' }}>
          -20%, which is like 72 days for free.
        </div>
        <span className="ml-3" style={{ fontSize: isMobile ? '0.8em' : '1em' }}>Annually</span>
          <label className="switch" style={{ margin: 10 }}>
            <input type="checkbox" checked={isMonthly} onChange={() => setIsMonthly(!isMonthly)} />
            <span className="slider round"></span>
          </label>
        <span className="ml-3" style={{ fontSize: isMobile ? '0.8em' : '1em' }}>Monthly</span>
      </div>


      { isMobile ? 
      <Col>
        {Object.values(payment_plans_state).map((plan, index) => (
          <div key={index} >
            <Card className="text-center" style={{ marginBottom: 50, borderRadius: '25px', boxShadow: '0px 0px 10px rgba(0,0,0,0.5)' }}>
            <Card.Header style={getHeaderStyle(plan.name)}>{plan.name}</Card.Header>
              <Card.Body>
                <Card.Title style={{ fontSize: '1.5em' }}>${isMonthly ? plan.price_subscription_month_1 : plan.price_subscription_month_2} {'/month'}</Card.Title>
                <Card.Title style={{ fontSize: '1em' }}>${isMonthly ? plan.price_subscription_year_1 : plan.price_subscription_year_2} {'/year'}</Card.Title>
                <PayButton theme={theme} plan={plan.name} monthly={isMonthly}/>
                <ListGroup className="list-group-flush">
                  {plan.access.map((access, index) => (
                    <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                      <div style={{ width: '50%', textAlign: 'left' }}>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip(access.description)}
                        >
                          <span style={{ textDecoration: 'underline' }}>{access.name}</span>
                        </OverlayTrigger>
                      </div>
                      <div style={{ width: '40%', textAlign: 'right' }}>
                        {timeframes.includes(access.name) ? (access.on ? <CheckCircleFill color="green"/> : <XCircleFill color="red"/>) : <ProgressBar now={access.number/access.all*100} />}
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Col>
        :
      <Row>
        {Object.values(payment_plans_state).map((plan, index) => (
          <Col key={index} >
            <Card className="text-center" style={{ marginBottom: 50, borderRadius: '25px', boxShadow: '0px 0px 10px rgba(0,0,0,0.5)' }}>

              <Card.Header style={getHeaderStyle(plan.name)}>{plan.name}</Card.Header>
              <Card.Body>
                <Card.Title style={{ fontSize: '1.5em' }}>${isMonthly ? plan.price_subscription_month_1 : plan.price_subscription_month_2} {'/month'}</Card.Title>
                <Card.Title style={{ fontSize: '1em' }}>${isMonthly ? plan.price_subscription_year_1 : plan.price_subscription_year_2} {'/year'}</Card.Title>
                <PayButton theme={theme} plan={plan.name} monthly={isMonthly}/>
                <ListGroup className="list-group-flush">
                  {plan.access.map((access, index) => (
                    <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                      <div style={{ width: '50%', textAlign: 'left' }}>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip(access.description)}
                        >
                          <span style={{ textDecoration: 'underline' }}>{access.name}</span>
                        </OverlayTrigger>
                      </div>
                      <div style={{ width: '40%', textAlign: 'right' }}>
                        {timeframes.includes(access.name) ? (access.on ? <CheckCircleFill color="green"/> : <XCircleFill color="red"/>) : <ProgressBar now={access.number/access.all*100} />}
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      }
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ marginRight: 10 }}>
          *If you subscribe to any of the annual packages before September 30, 2024, you will receive a permanent star on your account that will be displayed next to your avatar.
        </p>
        <div style={{ marginBottom: 10 }}>
          <AvatarWithBadge src={"placeholder_avatar.jpg"} badgeColor={'green'} width={40} height={40} />
        </div>
      </div>
    </Container>
    </div>
  );
}

export default Pricing;
