import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';

function Footer() {
    const theme = useSelector(state => state.data.theme);
    const location = useLocation();
    const isHomePage = location.pathname === '/home' || location.pathname === '/';
    const [windowSize, setWindowSize] = useState(window.innerWidth)

    useEffect(() => {
      const handleResize = () => {
        console.log(window.innerWidth)
        setWindowSize(window.innerWidth);
      };
  
      handleResize();
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [window.innerWidth]);

  return (
    <MDBFooter style={{zIndex:-9999, position: 'static', fontFamily: isHomePage ? 'TextFont_1' : 'defaultFont', backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black' }} >
      <section  className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='facebook-f' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='twitter' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='google' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='instagram' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='linkedin' />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='github' />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3 flex-column-reverse flex-md-row'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{fontSize: '0.8rem'}}>
                <MDBIcon color='secondary' icon='gem' className='me-3' />
                CHARBT
              </h6>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{fontSize: '0.8rem', fontFamily: isHomePage ? 'TextFont_1' : 'defaultFont' }}>Products</h6>
              <p style={{fontSize: '0.7rem'}}>
                <a href='/referal_program' className='text-reset'>
                  Referal Program
                </a>
              </p>
              <p style={{fontSize: '0.7rem'}}>
                <a href='/mobile_app' className='text-reset'>
                  Android
                </a>
              </p>
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{fontSize: '0.8rem'}}>Useful links</h6>
              <p style={{fontSize: '0.7rem'}}>
                <a href='/pricing' className='text-reset'>
                  Pricing
                </a>
              </p>
              <p style={{fontSize: '0.7rem'}}>
                <a href='/terms_of_service' className='text-reset'>
                  Terms Of Service
                </a>
              </p>
              <p style={{fontSize: '0.7rem'}}>
                <a href='/privacy_policy' className='text-reset'>
                Privacy Policy
                </a>
              </p>
              <p style={{fontSize: '0.7rem'}}>
                <a href='/support' className='text-reset'>
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{fontSize: '0.8rem'}}>Contact</h6>
              <a href="mailto:andremdev@outlook.com" className='text-reset' style={{fontSize: '0.7rem'}}>Let's collaborate</a>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </MDBFooter>
  );
}
export default Footer;
