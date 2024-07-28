import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Dropdown from 'react-bootstrap/Dropdown';
import { faMoon, faLightbulb, faRightFromBracket, faBolt } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { toggleTheme, clearMarkers, resetStopLossLine, resetTakeProfitLine } from '../../redux/dataActions';
import { reloadUser, setGlobalSettings } from '../../redux/userActions';
import { Spinner } from 'react-bootstrap';
import { getGSettings } from '../../api/data';
import AvatarWithBadge from './Avatar';
import { showNewPost } from '../../services/services';

function NavB() {
  const location = useLocation();
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user);
  const globalSettings = useSelector(state => state.user.globalSettings);
  const loading = useSelector(state => state.user.loading);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const getPaymentStatus = () => {
    let status = 0;
    let color = 'grey';
    switch(user.payment_status) {
      case 'default':
        status = 100;
        color = 'info';
        break;
      case 'essential':
        status = 100;
        color = 'success';
        break;
      case 'premium':
        status = 100;
        color = 'danger';
        break;
      case 'premium-plus':
        status = 100;
        color = 'warning';
        break;
      default:
        status = 100;
        color = 'grey';
    }
    return {status, color};
  };
  const handleProgressBarClick = () => {
    // Обработка клика на ProgressBar
  };

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(reloadUser(navigate));
    };
    if (!user && window.localStorage.getItem('jwt')) {
      fetchUser()
    }
    if (!globalSettings) {
      const getGS = async () => {
        const settings = await getGSettings()
        dispatch(setGlobalSettings(settings))
      };
      getGS()
    }
  }, []);

  const changeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
    dispatch(toggleTheme());
  };

  const handleTradingClick = () => {
    navigate('/trading');
  };

  const handleHomeClick = () => {
    navigate('/home');
  }
  const handleLogOut = () => {
    window.localStorage.removeItem('jwt')
    window.localStorage.removeItem("draw_lines")
    dispatch({ type: 'RESET_USER' });
    dispatch(clearMarkers())
    dispatch(resetStopLossLine())
    dispatch(resetTakeProfitLine())
    navigate('/login');
}

  const handleScreenshotsPage = () => {
    navigate('/screenshots');
  }
  const handlePricing = () => {
    navigate('/pricing');
  }
  const referal = () => {
    navigate('/referal_program')
  }
  const billing = () => {
    navigate('/billing_settings')
  }
  const profile = () => {
    navigate('/profile_settings')
  }

  const blog = () => {
    navigate('/blog')
  }


  return (
    loading ? 
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div> :
    <Navbar expand="lg" style={{ backgroundColor: 'var(--navbar-bg-color)', color: 'var(--navbar-text-color)', paddingTop: '0.0rem', paddingBottom: '0.0rem' }}>
      <Container fluid>
      <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'baseline', textDecoration: 'none'}}>
        <span style={{ color: 'green', fontWeight: 'bold' }}>Char</span>
        <img
          src="logo.png"
          width="25"
          height="25"
          className="d-inline-block align-top"
          alt="logo"
          style={{ marginBottom: '-10px', marginLeft: 3, marginRight: 3 }}
        />
        <span style={{ color: 'green', fontWeight: 'bold' }}>BT</span>
      </Navbar.Brand>




        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {location.pathname !== '/login' && (
              <>
                <Nav.Link onClick={handleHomeClick} style={{ color: 'var(--navbar-text-color)'}}>Home</Nav.Link>
                { user && <Nav.Link onClick={handleTradingClick} style={{ color: 'var(--navbar-text-color)'}}>Trading</Nav.Link> }
                { user && <Nav.Link onClick={handleScreenshotsPage} style={{ color: 'var(--navbar-text-color)'}}>Screenshots</Nav.Link> }
                <Nav.Link onClick={handlePricing} style={{ color: 'var(--navbar-text-color)'}}>Pricing</Nav.Link>
                {globalSettings && globalSettings.blogOn && <Nav.Link onClick={blog} style={{ color: 'var(--navbar-text-color)', position: 'relative' }}>
                  Blog/Voting
                  {user && showNewPost(user.blogLastVisit, globalSettings.blogLastPost) && 
                    <span style={{ 
                      color: 'red', 
                      position: 'absolute', 
                      top: 3, 
                      right: -3 
                    }}>➊</span>
                  }
                </Nav.Link>}


              </>
            )}
          </Nav>

          

          {user ? (
            <>
              {/* <Image src={user.avatarLink || "placeholder_avatar.jpg"} roundedCircle style={{ width: 40, height: 40, marginRight: 15 }} /> */}
              <div style={{marginRight: 10}}>
              <AvatarWithBadge src={user.avatarLink || "placeholder_avatar.jpg"} badgeColor={user.badge} width={40} height={40} />
              </div>
              <Navbar.Text className="ml-auto" style={{ color: 'var(--navbar-text-color)', fontSize: '1.5em' }}>
                {user.username}
                <ProgressBar variant={getPaymentStatus().color} onClick={handleProgressBarClick} now={getPaymentStatus().status} label={<span style={{ fontSize: 10, color: 'white', textShadow: '2px 2px 4px #000000', fontWeight: 'bold'}}>{`${user.payment_status.toUpperCase()}`}</span>} style={{ width: '100px', marginRight: '1em', cursor: 'pointer' }}/>
              </Navbar.Text>
              
              <NavDropdown align="end" title="" id="navbarScrollingDropdown" className="ml-auto" style={{ color: 'var(--navbar-text-color)', fontSize: '1.5em', marginRight: '1em', backgroundColor: 'var(--navbar-bg-color)' }}>
                <NavDropdown.Item onClick={profile} style={{ color: 'var(--navbar-text-color)'}}>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={billing} style={{ color: 'var(--navbar-text-color)'}}>Account and Billing</NavDropdown.Item>
                <NavDropdown.Item onClick={referal} style={{ color: 'var(--navbar-text-color)'}}>Referal Program</NavDropdown.Item>
                <Dropdown.Divider />
                <NavDropdown.Item onClick={handleLogOut} style={{ color: 'var(--navbar-text-color)'}}><div style={{width: '100%', textAlign: 'justify'}}>Log Out <FontAwesomeIcon style={{marginLeft: 10}} icon={faRightFromBracket}></FontAwesomeIcon></div></NavDropdown.Item>
              </NavDropdown>

            </>
          ) : (
            location.pathname !== '/login' && (
              <Link to="/login" className="ml-auto me-3" >
                <Button variant="outline-success" className='fw-bold'>Log in / Sign Up</Button>
              </Link>
            )
          )}
          <>
            <FontAwesomeIcon onClick={changeTheme} style={{marginRight: 15, cursor: 'pointer', fontSize: 25}} icon={theme === 'light' ? faMoon : faLightbulb} />
          </>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavB;


