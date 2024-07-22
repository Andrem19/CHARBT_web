import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { setPlan, setMonthly } from '../../redux/paymentActions';

export function PayButton({ theme, plan, monthly }) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate()
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const buttonStyle = {
    width: '70%',
    padding: '10px 0 20px 0',
    backgroundColor: hover ? '#c6c8ca' : (theme === 'light' ? '#dee2e6' : '#343a40'),
    border: 'none',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    color: theme === 'light' ? 'black' : 'white',
    fontSize: '1.2em',
    marginBottom: 10
  };

  const toCheckout = (plan) => {
    if (user) {
      dispatch(setPlan(plan))
      dispatch(setMonthly(monthly))
      navigate(`/checkout`)
    } else {
      navigate('/login')
    }
  }

  return (
    <Button 
      variant="primary" 
      style={buttonStyle} 
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)}
      onClick={() => toCheckout(plan)}
    >
      Subscribe
    </Button>
  );
}