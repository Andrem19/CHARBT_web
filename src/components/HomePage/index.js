import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

function HomePage() {
  const theme = useSelector(state => state.data.theme);
  const isMobile = useSelector(state => state.user.isMobile);
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate()

  const handleSignUp = () => {
    navigate('/login');
  };

  const handleQRCodeClick = () => {
    window.open('https://apknow.one/EIk2DE7gpiKC6J5', '_blank');
  };

  return (
    <Container fluid style={{ backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: isMobile ? 'auto' : 'auto', paddingTop: '1rem' }}>
      <h1 style={{ fontFamily: !isMobile ? 'TextFont_1' : '' }}>Historical Data Trading Simulation</h1>
      {/* <h2 style={{ fontFamily: !isMobile ? 'TextFont_1' : '' }}> Crypto, Stock, Forex</h2> */}
      <h3 style={{ marginRight: 200, marginLeft: 200, fontFamily: !isMobile ? 'TextFont_1' : '' }}>CharBT is a service focused exclusively on the educational process for traders. Which gives the opportunity to test your skills without risking real funds in a fully simulated environment on historical data.</h3>
      <div style={{ width: isMobile ? '100%' : '80%', height: isMobile ? 'auto' : '50%', border: '1px solid black', borderRadius: '10px', overflow: 'hidden', position: 'relative', fontFamily: 'TextFont_1', margin: isMobile ? '1rem' : '1rem 0' }}>
    <video autoPlay loop muted style={{ width: '100%', height: isMobile ? 'auto' : '100%', objectFit: isMobile ? 'contain' : 'cover' }}>
      <source src="charbt_tutorial.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    {!user && (
      <Button onClick={handleSignUp} variant="primary" size={isMobile ? "sm" : "lg"} style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', opacity: 0.6, height: isMobile ? '35px' : '60px', width: isMobile ? '120px' : '250px' }}>
        <span style={{ fontSize: isMobile ? 15 : 25 }}>Sign Up</span>
      </Button>
    )}
  </div>

  <div style={{ width: isMobile ? '100%' : '80%', height: isMobile ? 'auto' : '50%', border: '1px solid black', borderRadius: '10px', overflow: 'hidden', position: 'relative', fontFamily: 'TextFont_1', margin: isMobile ? '1rem' : '1rem 0' }}>
        <Image src="android_app.jpg" alt="Download our app" style={{ width: '100%', height: isMobile ? 'auto' : '100%', objectFit: isMobile ? 'contain' : 'cover' }} />
        <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '5px', backgroundColor: 'white', borderRadius: '5px', cursor: 'pointer' }} onClick={handleQRCodeClick}>
          <QRCode value="https://apknow.one/EIk2DE7gpiKC6J5" size={isMobile? 48 : 148} />
        </div>
        <div style={{ position: 'absolute', top: '10px', left: isMobile ? '40%' : '40%', transform: 'translateX(-50%)', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px 10px', borderRadius: '5px', fontSize: isMobile ? '1em' : '1.5em', fontFamily: 'TextFont_1' }}>
          <span style={{ fontSize: isMobile ? 13 : 40 }}>Download our app and get access anywhere...</span>
        </div>
        {!user && !isMobile && (
          <Button onClick={handleSignUp} variant="primary" size={isMobile ? "sm" : "lg"} style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', opacity: 0.6, height: isMobile ? '35px' : '60px', width: isMobile ? '120px' : '250px' }}>
            <span style={{ fontSize: isMobile ? 15 : 25 }}>Sign Up</span>
          </Button>
        )}
      </div>



      <div style={{ width: isMobile ? '100%' : '80%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: isMobile ? '0' : '1rem' }}>
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
