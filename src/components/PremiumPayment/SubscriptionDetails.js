import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reloadUser, setMsg } from '../../redux/userActions';
import { checkoutReq } from '../../api/payment';
import Modal from '../ServicePage/modalText';
import { getText } from '../../api/data';
import { API_URL } from '../../config';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';

function SubscriptionDetails() {
  const [isChecked, setIsChecked] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDate, setModalDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reqSended, setReqSended] = useState(false);
  const dispatch = useDispatch();
  const plan = useSelector(state => state.payment.plan);
  const theme = useSelector((state) => state.data.theme);
  const isMobile = useSelector(state => state.user.isMobile);
  const user = useSelector(state => state.user.user);
  const token_id = useSelector(state => state.payment.token_id);
  const monthly = useSelector(state => state.payment.monthly);
  const payment_plans_state = useSelector(state => state.data.payment_plans);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const createSubscription = async (paymentIntentId) => {
    const jwt = localStorage.getItem('jwt');
    
    if (!jwt || jwtExpired(jwt)) {
        navigate('/login');
        return;
    }
    const response = await fetch(`${API_URL}/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}` // Добавляем JWT токен в заголовок
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
      }),
    });

    const data = await response.json();
    if (data.message === 'Subscription created successfully') {
        console.log('Subscription created successfully');
    } else {
        console.error('Subscription creation failed');
    }
};


  const onSubmit = async () => {
    setReqSended(true);
    const result = await checkoutReq(navigate, token_id, plan, monthly);
    // dispatch(setMsg(result));
    console.log('result.client_secret', result.client_secret)
    const { error, paymentIntent } = await stripe.confirmCardPayment(result.client_secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          email: user.email,
        },
      },
    });
    console.log('error, paymentIntent', error, paymentIntent)

    if (error) {
      dispatch(setMsg('error'));
    } else if (paymentIntent.status === 'succeeded') {
      const res = await createSubscription(paymentIntent.id)
      console.log('res', res)
      dispatch(setMsg('Payment succeeded!'));
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/trading');
      await new Promise(resolve => setTimeout(resolve, 3000));
      dispatch(reloadUser(navigate));
    }
  };

  const handleLinkClick = async (name_id) => {
    const data = await getText(name_id);
    setModalContent(data.text);
    setModalTitle(data.name);
    setModalDate(data.date);
    setIsModalOpen(true);
  };

  // Find the selected plan
  const selectedPlan = Object.values(payment_plans_state).find(p => p.name === plan);
  const amount = monthly ? selectedPlan.price_subscription_month_1 : selectedPlan.price_subscription_year_2;
  const period = monthly ? 'month' : 'year';

  return (
    <div className={isMobile ? "mobile-checkout-details" : "checkout-details"}>
      <h2>Subscription Details</h2>
      <p>
        <b>Upcoming Payment: </b> An amount of ${amount} will be charged now and every {period} until the subscription is cancelled.
      </p>
      <table style={{ width: '100%', backgroundColor: '#f8f9fa', borderCollapse: 'collapse', marginBottom: 15 }}>
        <tr style={{ backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)' }}>
          <th style={{ textAlign: 'left', borderBottom: '1px solid #dee2e6', padding: '0.5em' }}>Plan</th>
          <th style={{ textAlign: 'right', borderBottom: '1px solid #dee2e6', padding: '0.5em', marginRight: '1em' }}>Amount</th>
        </tr>
        <tr style={{ backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)' }} >
          <td style={{ textAlign: 'left', borderBottom: '1px solid #dee2e6', padding: '0.5em' }}>{plan}</td>
          <td style={{ textAlign: 'right', borderBottom: '1px solid #dee2e6', padding: '0.5em' }}>${amount}</td>
        </tr>
      </table>

      <div className="terms-row">
        <input type="checkbox" id="terms" name="terms" value="terms" onChange={handleCheckboxChange} />
        <label htmlFor="terms">
          I authorize CharBt to charge me automatically until I cancel my subscription. I have read and agree to CharBt <span style={{textDecoration: 'underline', fontWeight: 'bold', color: theme === 'dark' ? 'white' : 'blue', cursor: 'pointer'}} onMouseDown={(e) => { e.stopPropagation(); handleLinkClick('terms_of_service'); }}>Terms of Service</span> and <span style={{textDecoration: 'underline', fontWeight: 'bold', color: theme === 'dark' ? 'white' : 'blue', cursor: 'pointer'}} onMouseDown={(e) => { e.stopPropagation(); handleLinkClick('privacy_policy'); }}>Privacy Policy</span>.
        </label>
      </div>
      <button className="subscription-button" onClick={isChecked && !reqSended ? onSubmit : null} disabled={!isChecked || token_id == null}>
        Start Subscription
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} content={modalContent} acceptTerms={false} date={modalDate} />
    </div>
  );
}

export default SubscriptionDetails;
