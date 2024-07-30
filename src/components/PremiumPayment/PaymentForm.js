import React, { useState, use } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { setError, setToken } from '../../redux/paymentActions';
import { useDispatch, useSelector } from 'react-redux';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#32325d" }
    },
    invalid: { color: "#fa755a", iconColor: "#fa755a" }
  }
};


function PaymentForm() {
  const [cardComplete, setCardComplete] = useState(false);
  const [expiryComplete, setExpiryComplete] = useState(false);
  const [cvcComplete, setCvcComplete] = useState(false);

  const theme = useSelector((state) => state.data.theme);
  const error = useSelector(state => state.payment.error);
  const isMobile = useSelector(state => state.user.isMobile);
  const plan = useSelector(state => state.payment.plan);
  const monthly = useSelector(state => state.payment.monthly);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      dispatch(setError(event.error.message));
    }
  };

  const handleExpiryChange = (event) => {
    setExpiryComplete(event.complete);
    if (event.error) {
      dispatch(setError(event.error.message));
    }
  };

  const handleCvcChange = (event) => {
    setCvcComplete(event.complete);
    if (event.error) {
      dispatch(setError(event.error.message));
    }
  };

  const handleBlur = async () => {
    if (cardComplete && expiryComplete && cvcComplete) {
      const cardNumberElement = elements.getElement(CardNumberElement);
      const result = await stripe.createToken(cardNumberElement);
      
      if (result.error) {
        dispatch(setError(result.error.message));
      } else {
        dispatch(setToken(result.token.id));
      }
    }
  };

  return (
    <div className={isMobile ? "mobile-checkout-form" : "checkout-form"}>
      <h2 className="left-align">Subscription {plan} (pay {monthly ? 'monthly' : 'annually'})</h2>
      <p className="left-align">Details</p>
      <p className="left-align">The bank may hold and release $1 US to verify the card.</p>
      <form>
        <label className="left-align card-number" style={{ flex: 1 }}>
          <span style={{ fontSize: 10 }}>CARD NUMBER</span>:
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardChange} onBlur={handleBlur} />
        </label>
        <div className="card-details-row">
          <div className="expiry-and-cvc">
            <label className="left-align expiry-field">
              <span style={{ fontSize: 10 }}>EXPIRATION DATE</span>:
              <CardExpiryElement options={CARD_ELEMENT_OPTIONS} onChange={handleExpiryChange} onBlur={handleBlur} />
            </label>
            <label className="left-align cvc-field">
              <span style={{ fontSize: 10 }}>CVC</span>:
              <CardCvcElement options={CARD_ELEMENT_OPTIONS} onChange={handleCvcChange} onBlur={handleBlur} />
            </label>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default PaymentForm;
