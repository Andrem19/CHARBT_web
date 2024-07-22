import React from 'react';
import PaymentForm from './PaymentForm';
import SubscriptionDetails from './SubscriptionDetails';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_KEY } from '../../config';
import './checkoutForm.css';

const stripePromise = loadStripe(STRIPE_KEY);

function Checkout() {

  return (
    <div className="checkout-page">
      <h1 className="title">CharBt</h1>
      <div className="content-row">
        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
        <SubscriptionDetails />
      </div>
    </div>
  );
}

export default Checkout;
