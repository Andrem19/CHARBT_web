import React from 'react';
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const theme = useSelector(state => state.data.theme);
  const navigate = useNavigate()

  const handleSignUp = () => {
    navigate('/login');
  };

  return (
    <Container fluid style={{ backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '200vh', paddingTop: '1rem' }}>
      <div style={{ width: '80%', height: '50%', border: '1px solid black', borderRadius: '10px', overflow: 'hidden', position: 'relative', '@media (max-width: 768px)': { width: '100%' } }}>
        <Image src="candles_3.png" alt="Candles" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <Row className="justify-content-md-center" style={{ position: 'relative', height: '100%' }}>
          <Col md="auto" style={{ position: 'absolute', top: '10%', left: '10%', zIndex: 1 }}>
            <ul style={{ color: 'white', fontSize: '46px', textAlign: 'left', fontWeight: 'bold', '@media (max-width: 768px)': { fontSize: '20px' } }}>
              <li style={{ textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black' }}>Create Your Own Trading Laboratory</li>
              <li style={{ textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black' }}>Trade historical data on 20 trading pairs and 5 timeframes (100 data sets)</li>
              <li style={{ textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black' }}>Improve Your Skills Without Limits...</li>
            </ul>
          </Col>
          <Col md="auto" style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, textAlign: 'center' }}>
            <Button onClick={handleSignUp} variant="primary" size="lg" style={{ height: '60px', width: '250px', marginRight: '10px', '@media (max-width: 768px)': { height: '40px', width: '150px' } }}><span style={{ fontSize: 25, '@media (max-width: 768px)': { fontSize: 15 } }}>Sign Up</span></Button>
          </Col>
        </Row>
      </div>
      <div style={{ width: '80%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', '@media (max-width: 768px)': { width: '100%' } }}>
        <Card style={{ width: '100%', padding: '1rem', backgroundColor: theme == 'dark'? '#C4BCB5' : '#f2f2f2' }}>
          <Card.Body style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Row xs={3}>
              <Col style={{ padding: '1rem' }}><Image src="screen_2/buy_sell.png" alt="Buy and Sell" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', '@media (max-width: 768px)': { fontSize: '0.8em' } }}>Buy and Sell</p></Col>
              <Col style={{ padding: '1rem' }}><Image src="screen_2/indicators.png" alt="Add Indicators" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', '@media (max-width: 768px)': { fontSize: '0.8em' } }}>Add Indicators</p></Col>
              <Col style={{ padding: '1rem' }}><Image src="screen_2/lines.png" alt="Draw Lines" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', '@media (max-width: 768px)': { fontSize: '0.8em' } }}>Draw Lines</p></Col>
            </Row>
            <Row xs={3}>
              <Col style={{ padding: '1rem' }}><Image src="screen_2/photo.png" alt="Take Screenshots of Chart" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', '@media (max-width: 768px)': { fontSize: '0.8em' } }}>Save chart screenshots in cloud storage with permanent access</p></Col>
              <Col style={{ padding: '1rem' }}><Image src="screen_2/TPSL.png" alt="Set Take Profit and Stop Loss" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', '@media (max-width: 768px)': { fontSize: '0.8em' } }}>Set Take Profit and Stop Loss</p></Col>
              <Col style={{ padding: '1rem' }}><Image src="screen_2/statistic.png" alt="Detailed Statistics" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', '@media (max-width: 768px)': { fontSize: '0.8em' } }}>Detailed Statistics</p></Col>
            </Row>
            <Button onClick={handleSignUp} variant="primary" size="lg" style={{ height: '60px', width: '250px', marginTop: '10px', alignSelf: 'center', '@media (max-width: 768px)': { height: '40px', width: '150px' } }}><span style={{ fontSize: 25, '@media (max-width: 768px)': { fontSize: 15 } }}>Sign Up</span></Button>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
  
}

export default HomePage;
