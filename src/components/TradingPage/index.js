import React, { useEffect, useState, useRef } from 'react';
import Chart from './chart';
import ControlPanel from './control_panel';
import SessionInfo from './session_info';
import PositionsList from './positions_list';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reloadUser, setIsMobile } from '../../redux/userActions'
import { Spinner, Container } from 'react-bootstrap';
import './css/Trading.css';

function Trading() {

  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading);
  const isMobile = useSelector(state => state.user.isMobile);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const [isLoading, setIsLoading] = useState('init');


  useEffect(() => {
    
    const fetchUser = async () => {
      setIsLoading('start')
      await dispatch(reloadUser(navigate));
      setIsLoading('finish')
    };
    if (isLoading === 'init' && localStorage.getItem('jwt')) {
      fetchUser();
    }

  }, [isLoggedIn]);
  
  useEffect(() => {
    if (!user && isLoading === 'finish') {
      navigate('/login');
    }
  }, [isLoading]);

  const containerchart = {
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    height: isMobile ? '150vh' : '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    isLoading === 'start'? 
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div> :
    isLoading === 'finish' && user ?
    <div style={containerchart}>
      <div className='rowchart'>
          <Chart isMobile={isMobile}></Chart>
        <div className='controlPanel'>
          <ControlPanel></ControlPanel>
        </div>
      </div>
      <div className='rowchart'>
        {isMobile ? (
          <>
            <div className='sessionInfo'>
              <SessionInfo></SessionInfo>
            </div>
            <div className='positionList'>
              <PositionsList></PositionsList>
            </div>
          </>
        ) : (
          <>
            <div className='positionList'>
              <PositionsList></PositionsList>
            </div>
            <div className='sessionInfo'>
              <SessionInfo></SessionInfo>
            </div>
          </>
        )}
      </div>
    </div> : 
    null
  );
  
}

export default Trading;
