import axios from 'axios';
import { API_URL, PUB_URL } from '../config';
import { apiRequest } from '../services/services'

export async function getPaymentPlans() {
    try {
        const response = await axios.get(`${PUB_URL}/payment_plans`);
        console.log(1, response.data)
        return response.data;
    } catch (error) {
        console.error(`Error fetching payment plans: ${error}`);
    }
}

export async function checkoutReq(navigate, token, plan, monthly) {
  try {
      const data = { token: token, plan: plan, type: monthly ? 'monthly' : 'annualy' };
      const response = await apiRequest(navigate, 'POST', '/checkout', data);
      
      if (response) {
          return response.data.message;
      } else {
          console.error('Error fetching payment plans');
          return null;
      }
  } catch (error) {
      console.error(`Error in checkoutReq: ${error}`);
      return null;
  }
};

export const purchasePlan = async (navigate, plan, days) => {
  try {
      const data = { plan: plan, days: days };
      const response = await apiRequest(navigate, 'POST', '/tokens_subscription', data);
      
      if (response) {
          return response.data.message;
      } else {
          console.error('Error purchasing plan');
          return null;
      }
  } catch (error) {
      console.error('Error in purchasePlan:', error);
      return null;
  }
};

export const transferTokens = async (navigate, tokens, refcode) => {
  try {
      const data = { tokens, refcode };
      const response = await apiRequest(navigate, 'POST', '/transfer_tokens', data);
      
      if (response) {
          return response.data.message;
      } else {
          console.error('Error transferring tokens');
          return null;
      }
  } catch (error) {
      console.error('Error in transferTokens:', error);
      return null;
  }
};

export const cancelSubscription = async (navigate) => {
  try {
      const response = await apiRequest(navigate, 'POST', '/cancel_subscription');
      
      if (response) {
          return response.data.message;
      } else {
          console.error('Error cancelling subscription');
          return null;
      }
  } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return null;
  }
};

