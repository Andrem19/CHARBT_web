import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { reloadUser, setMsg } from '../../redux/userActions'
import { checkoutReq } from '../../api/payment';
import Modal from '../ServicePage/modalText';
import { getText } from '../../api/data';

function SubscriptionDetails() {
  const [isChecked, setIsChecked] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDate, setModalDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reqSended, setReqSended] = useState(false)
  const dispatch = useDispatch();
  const plan = useSelector(state => state.payment.plan);
  const theme = useSelector((state) => state.data.theme);
  const isMobile = useSelector(state => state.user.isMobile);
  const token_id = useSelector(state => state.payment.token_id);
  const monthly = useSelector(state => state.payment.monthly);
  const payment_plans_state = useSelector(state => state.data.payment_plans);
  const navigate = useNavigate()

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const onSubmit = async () => {
    const result = await checkoutReq(navigate, token_id, plan, monthly)
    setReqSended(true)
    dispatch(setMsg(result))
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/trading')
    await new Promise(resolve => setTimeout(resolve, 3000));
    dispatch(reloadUser(navigate))
  }

  const handleLinkClick = async (name_id) => {
    const data = await getText(name_id);
    setModalContent(data.text);
    setModalTitle(data.name);
    setModalDate(data.date);
    setIsModalOpen(true);
  }

  // Find the selected plan
  const selectedPlan = Object.values(payment_plans_state).find(p => p.name === plan);
  const amount = monthly ? selectedPlan.price_subscription_month_1 : selectedPlan.price_subscription_year_2;
  const period = monthly ? 'month' : 'year';

  return (
    <div className={ isMobile? "mobile-checkout-details" : "checkout-details"}>
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
        <label for="terms">
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
