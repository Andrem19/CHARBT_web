import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const theme = useSelector(state => state.data.theme);
  const isMobile = useSelector(state => state.user.isMobile);
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate()

  const handleSignUp = () => {
    navigate('/login');
  };

  return (
    <Container fluid style={{ backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: isMobile ? '300vh' : '200vh', paddingTop: '1rem' }}>
      <div style={{ width: isMobile ? '100%' : '80%', height: '50%', border: '1px solid black', borderRadius: '10px', overflow: 'hidden', position: 'relative', fontFamily: 'TextFont_1' }}>
        <Image src="HomePageBackground.png" alt="Candles" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <Row className="justify-content-md-center" style={{ position: 'relative', height: '100%', justifyContent: 'space-between' }}>
          {isMobile? <Col md="auto" style={{ position: 'absolute', top: '10%', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ fontWeight: 'bold', marginBottom: '120px', fontSize: isMobile ? '1.5em' : '2.5em' }}>
            <span style={{ color: '#00d8b2'}}>MASTER TRADING WITH</span> 
            <span style={{ color: '#ff7f6c' }}>CharBT</span>
          </h1>
            <ul style={{ color: '#00d8b2', fontSize: isMobile ? '1em' : '1.5em', textAlign: 'left', listStyleType: 'none', fontWeight: 'bold' }}>
              <li style={{ textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black', marginBottom: isMobile ? '15px' : '30px' }}><span style={{ color: '#ff7f6c' }}>HISTORICAL MARKET REPLAY:</span> Practice trading with real data from past stock and crypto markets</li>
              <li style={{ textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black', marginBottom: isMobile ? '15px' : '30px' }}><span style={{ color: '#ff7f6c' }}>STRATEGY TESTING:</span> Experiment with your trading strategies in historical market scenarios</li>
              <li style={{ textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black', marginBottom: isMobile ? '15px' : '30px' }}><span style={{ color: '#ff7f6c' }}>RISK-FREE LEARNING:</span> Hone your trading skills without any financial risk</li>
              <li style={{ textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black', marginBottom: isMobile ? '15px' : '30px' }}><span style={{ color: '#ff7f6c' }}>INSIGHTFUL FEEDBACK:</span> Get detailed analysis on your trading performance and improve</li>
              <li style={{ textShadow: '-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black', marginBottom: isMobile ? '15px' : '30px' }}><span style={{ color: '#ff7f6c' }}>FLEXIBLE ACCESS:</span> Trade anytime, from any device, with our user-friendly platform</li>
            </ul>
          </Col> :
          <video autoPlay loop muted>
            <source src="charbt_tutorial.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>}
          <Col md="auto" style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1, textAlign: 'center' }}>
          {!user && <Button onClick={handleSignUp} variant="primary" size={isMobile ? "sm" : "lg"} style={{ opacity: !isMobile? 0.6 : 1, height: isMobile ? '40px' : '60px', width: isMobile ? '150px' : '250px', marginRight: '10px' }}>
            <span style={{ fontSize: isMobile ? 15 : 25 }}>Sign Up</span>
          </Button>}
          </Col>
        </Row>
      </div>


      <div style={{ width: isMobile ? '100%' : '80%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ width: '100%', padding: '1rem', backgroundColor: theme == 'dark'? '#C4BCB5' : '#f2f2f2' }}>
          <Card.Body style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {isMobile ? (
              <>
                <Image src="screen_2/buy_sell.png" alt="Buy and Sell" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: isMobile? '1em' : '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1'}}>Buy and Sell</p>
                <Image src="screen_2/indicators.png" alt="Add Indicators" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: isMobile? '1em' : '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1'}}>Add Indicators</p>
                <Image src="screen_2/lines.png" alt="Draw Lines" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: isMobile? '1em' : '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1'}}>Draw Lines</p>
                <Image src="screen_2/photo.png" alt="Take Screenshots of Chart" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: isMobile? '1em' : '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1' }}>Save chart screenshots in cloud storage with permanent access</p>
                <Image src="screen_2/TPSL.png" alt="Set Take Profit and Stop Loss" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: isMobile? '1em' : '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1' }}>Set Take Profit and Stop Loss</p>
                <Image src="screen_2/statistic.png" alt="Detailed Statistics" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: isMobile? '1em' : '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1' }}>Detailed Statistics</p>
              </>
            ) : (
              <>
                <Row xs={3}>
                  <Col style={{ padding: '1rem' }}><Image src="screen_2/buy_sell.png" alt="Buy and Sell" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1'}}>Buy and Sell</p></Col>
                  <Col style={{ padding: '1rem' }}><Image src="screen_2/indicators.png" alt="Add Indicators" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1'}}>Add Indicators</p></Col>
                  <Col style={{ padding: '1rem' }}><Image src="screen_2/lines.png" alt="Draw Lines" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1'}}>Draw Lines</p></Col>
                </Row>
                <Row xs={3}>
                  <Col style={{ padding: '1rem' }}><Image src="screen_2/photo.png" alt="Take Screenshots of Chart" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1' }}>Save chart screenshots in cloud storage with permanent access</p></Col>
                  <Col style={{ padding: '1rem' }}><Image src="screen_2/TPSL.png" alt="Set Take Profit and Stop Loss" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1' }}>Set Take Profit and Stop Loss</p></Col>
                  <Col style={{ padding: '1rem' }}><Image src="screen_2/statistic.png" alt="Detailed Statistics" style={{ width: '90%', height: 'auto', border: '2px solid black', borderRadius: '10px' }} /><p style={{ fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center', fontFamily: 'TextFont_1' }}>Detailed Statistics</p></Col>
                </Row>
              </>
            )}
            {!user && <Button onClick={handleSignUp} variant="primary" size={isMobile ? "sm" : "lg"} style={{ height: isMobile ? '40px' : '60px', width: isMobile ? '150px' : '250px', marginRight: '10px' }}>
              <span style={{ fontSize: isMobile ? 15 : 25 }}>Sign Up</span>
            </Button>}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
  
}

export default HomePage;
