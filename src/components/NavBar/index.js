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
import { useEffect, useState, useRef } from 'react';
import { toggleTheme, clearMarkers, resetStopLossLine, resetTakeProfitLine } from '../../redux/dataActions';
import { reloadUser, setGlobalSettings, setIsMobile, setScreenSize } from '../../redux/userActions';
import { Spinner, Form } from 'react-bootstrap';
import { getGSettings } from '../../api/data';
import AvatarWithBadge from './Avatar';
import { getDefaultSessionData, showNewPost } from '../../services/services';
import { setCurrentSession } from '../../redux/sessionActions';

function NavB() {
  const location = useLocation();
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user);
  const isMobile = useSelector(state => state.user.isMobile);
  const globalSettings = useSelector(state => state.user.globalSettings);
  const loading = useSelector(state => state.user.loading);
  const dispatch = useDispatch();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const isActive = (path) => {
    return location.pathname === path;
  }


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
    dispatch(setCurrentSession(getDefaultSessionData()))
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

  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 1020));
      dispatch(setScreenSize(window.innerWidth));
    };

    // Вызовите handleResize при загрузке страницы, чтобы установить начальное состояние
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  const changeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('dark', newTheme === 'dark');
    dispatch(toggleTheme());
  };

  const handleTradingClick = () => {
    navigate('/trading');
    setExpanded(false);
  };

  const handleHomeClick = () => {
    navigate('/home');
    setExpanded(false);
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
    setExpanded(false);
  }
  const handlePricing = () => {
    navigate('/pricing');
    setExpanded(false);
  }
  const referal = () => {
    navigate('/referal_program')
  }
  const personal_dataset = () => {
    navigate('/personal_dataset')
  }
  const billing = () => {
    navigate('/billing_settings')
  }
  const profile = () => {
    navigate('/profile_settings')
  }

  const blog = () => {
    navigate('/blog')
    setExpanded(false);
  }

  const loginsignup = () => {
    navigate('/login')
    setExpanded(false);
  }


  return (
    loading ? 
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div> :
    <Navbar expand="lg" expanded={expanded} onToggle={handleToggle} style={{ backgroundColor: 'var(--navbar-bg-color)', color: 'var(--navbar-text-color)', paddingTop: '0.0rem', paddingBottom: '0.0rem' }}>
      <Container fluid>
        <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'baseline', textDecoration: 'none'}}>
          <span style={{ color: '#00d8b2', fontWeight: 'bold', fontFamily: 'LogoFont_1', fontSize: isMobile ? 20 : 25 }}>Char</span>
          <img
            src="logo.png"
            width={isMobile ? 15 : 20}
            height={isMobile ? 15 : 20}
            className="d-inline-block align-top"
            alt="logo"
            style={{ marginBottom: isMobile ? '-8px' : '-10px', marginLeft: 3, marginRight: 3 }}
          />
          <span style={{ color: '#ff7f6c', fontWeight: 'bold', fontFamily: 'LogoFont_1', fontSize: isMobile ? 25 : 30 }}>BT</span>
        </Navbar.Brand>
  
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          {user && isMobile && (
            <>
              <div style={{marginRight: 10}}>
                <AvatarWithBadge src={user.avatarLink || "placeholder_avatar.jpg"} badgeColor={user.badge} width={isMobile ? 30 : 40} height={isMobile ? 30 : 40} />
              </div>
              <Navbar.Text style={{ color: 'var(--navbar-text-color)', fontSize: isMobile ? '1em' : '1.5em' }}>
                {user.username}
                <ProgressBar variant={getPaymentStatus().color} onClick={handleProgressBarClick} now={getPaymentStatus().status} label={<span style={{ fontSize: isMobile ? 8 : 10, color: 'white', textShadow: '2px 2px 4px #000000', fontWeight: 'bold'}}>{`${user.payment_status.toUpperCase()}`}</span>} style={{ width: isMobile ? '80px' : '100px', marginRight: '1em', cursor: 'pointer' }}/>
              </Navbar.Text>
              <NavDropdown align="end" title="" id="navbarScrollingDropdown" className="ml-auto" style={{ color: 'var(--navbar-text-color)', fontSize: isMobile ? '1em' : '1.5em', marginRight: '1em', backgroundColor: 'var(--navbar-bg-color)' }}>
                <NavDropdown.Item onClick={profile} style={{ color: 'var(--navbar-text-color)', fontSize: isMobile ? 12 : 16 }}>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={billing} style={{ color: 'var(--navbar-text-color)', fontSize: isMobile ? 12 : 16 }}>Account and Billing</NavDropdown.Item>
                <NavDropdown.Item onClick={referal} style={{ color: 'var(--navbar-text-color)', fontSize: isMobile ? 12 : 16 }}>Referal Program</NavDropdown.Item>
                <NavDropdown.Item disabled={user.payment_status === 'essential' || user.payment_status === 'default'} onClick={personal_dataset} style={{ fontSize: isMobile ? 12 : 16, color: 'var(--navbar-text-color)'}}><span style={{color: user.payment_status === 'essential' || user.payment_status === 'default' ? 'grey' : ''}}>Personal Dataset</span></NavDropdown.Item>
                <Dropdown.Divider />
                {isMobile && <>
                  <div onClick={changeTheme} style={{marginLeft: 15, cursor: 'pointer', fontSize: 15, color: 'white'}}>
                    <Form.Check 
                      type="switch"
                      id="themeSwitch"
                      label={`Theme ${theme === 'light' ? 'Light' : 'Dark'}`}
                    />
                  </div>
                </>}
                <Dropdown.Divider />
                <NavDropdown.Item onClick={handleLogOut} style={{ color: 'var(--navbar-text-color)', fontSize: isMobile ? 12 : 16 }}><div style={{width: '100%', textAlign: 'justify'}}>Log Out <FontAwesomeIcon style={{marginLeft: 10}} icon={faRightFromBracket}></FontAwesomeIcon></div></NavDropdown.Item>
              </NavDropdown>
            </>
          )}
          <Navbar.Toggle aria-controls="navbarScroll" />
        </div>
  
        <Navbar.Collapse id="navbarScroll" >
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Nav
            className="my-2 my-lg-0"
            style={{ maxHeight: isMobile ? 'none' : '100px' }}
            navbarScroll
          >
            {location.pathname !== '/login' && (
              <>
                <Nav.Link onClick={handleHomeClick} style={{ textDecoration: isActive('/home') ? 'underline' : 'none', color: 'var(--navbar-text-color)', textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '0.6em' : '1em' }}><span style={{ fontFamily: 'TextFont_1', fontSize: isMobile ? '1.5em' : '1em' }}>Home</span></Nav.Link>
                {<Nav.Link onClick={handleTradingClick} style={{ textDecoration: isActive('/trading') ? 'underline' : 'none', color: 'var(--navbar-text-color)', textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '0.6em' : '1em' }}><span style={{ fontFamily: 'TextFont_1', fontSize: isMobile ? '1.5em' : '1em' }}>Trading</span></Nav.Link> }
                { user && <Nav.Link onClick={handleScreenshotsPage} style={{ textDecoration: isActive('/screenshots') ? 'underline' : 'none', color: 'var(--navbar-text-color)', textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '0.6em' : '1em' }}><span style={{ fontFamily: 'TextFont_1', fontSize: isMobile ? '1.5em' : '1em' }}>Screenshots</span></Nav.Link> }
                <Nav.Link onClick={handlePricing} style={{ textDecoration: isActive('/pricing') ? 'underline' : 'none',  color: 'var(--navbar-text-color)', textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '0.6em' : '1em' }}><span style={{ fontFamily: 'TextFont_1', fontSize: isMobile ? '1.5em' : '1em' }}>Pricing</span></Nav.Link>
                {globalSettings && globalSettings.blogOn && <Nav.Link onClick={blog} style={{ textDecoration: isActive('/blog') ? 'underline' : 'none', color: 'var(--navbar-text-color)', position: 'relative', textAlign: isMobile ? 'center' : 'left', fontSize: isMobile ? '0.6em' : '1em' }}>
                  <span style={{ fontFamily: 'TextFont_1', fontSize: isMobile ? '1.5em' : '1em' }}>Info</span>
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
        </div>

          {user && !isMobile ? (
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
                <NavDropdown.Item disabled={user.payment_status === 'essential' || user.payment_status === 'default'} onClick={personal_dataset} style={{ color: 'var(--navbar-text-color)'}}><span style={{color: user.payment_status === 'essential' || user.payment_status === 'default' ? 'grey' : ''}}>Personal Dataset</span></NavDropdown.Item>
                <Dropdown.Divider />
                <NavDropdown.Item onClick={handleLogOut} style={{ color: 'var(--navbar-text-color)'}}><div style={{width: '100%', textAlign: 'justify'}}>Log Out <FontAwesomeIcon style={{marginLeft: 10}} icon={faRightFromBracket}></FontAwesomeIcon></div></NavDropdown.Item>
              </NavDropdown>

            </>
          ) : !user && !isMobile && (
            location.pathname !== '/login' && (

                <Button onClick={loginsignup}  variant="outline-success" className='fw-bold' style={{ minWidth: '180px' }}><span style={{ fontFamily: 'TextFont_1' }}>Log in / Sign Up</span></Button>

            
            )
          )}
  
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, marginLeft: 15 }}>
          {!user && isMobile && location.pathname !== '/login' && (

              <Button onClick={loginsignup} variant="outline-success" className='fw-bold' style={{ minWidth: isMobile ? '120px' : '180px' }}>
                <span style={{ fontFamily: 'TextFont_1', fontSize: isMobile ? 12 : 16 }}>Log in / Sign Up</span>
              </Button>

          )}
        </div>
          {!isMobile && <>
            <FontAwesomeIcon onClick={changeTheme} style={{marginRight: 15, cursor: 'pointer', fontSize: 25}} icon={theme === 'light' ? faMoon : faLightbulb} />
          </>}
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavB;


