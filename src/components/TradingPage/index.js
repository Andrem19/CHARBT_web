import React, { useEffect, useState} from 'react';
import Chart from './chart';
import ControlPanel from './control_panel';
import SessionInfo from './session_info';
import PositionsList from './positions_list';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reloadUser } from '../../redux/userActions'
import { Spinner } from 'react-bootstrap';

function Trading() {

  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading);
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

  const style = {
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  };

  return (
    isLoading === 'start'? 
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div> :
    isLoading === 'finish' && user ?
    <div style={style}>
      <div style={rowStyle}>
        <Chart></Chart>
        <ControlPanel></ControlPanel>
      </div>
      <div style={rowStyle}>
        <PositionsList></PositionsList>
        <SessionInfo></SessionInfo>
      </div>
    </div> : 
    null
  );
}

export default Trading;
