

export const setError = (error) => ({
    type: 'SET_ERROR',
    payload: error,
  });
  
  export const setToken = (token_id) => ({
    type: 'SET_TOKEN',
    payload: token_id,
  });
  
  export const setPlan = (plan) => ({
    type: 'SET_PLAN',
    payload: plan,
  });

  export const setMonthly = (plan) => ({
    type: 'SET_MONTHLY',
    payload: plan,
  });
  
  export const clearAll = () => ({
    type: 'CLEAR_ALL',
  });
  