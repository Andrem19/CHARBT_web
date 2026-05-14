const initialState = {
    error: null,
    token_id: null,
    plan: null,
    monthly: false,
  };
  
  const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      case 'SET_TOKEN':
        return { ...state, token_id: action.payload };
      case 'SET_PLAN':
        return { ...state, plan: action.payload };
      case 'SET_MONTHLY':
        return { ...state, monthly: action.payload };
      case 'CLEAR_ALL':
        return initialState;
      default:
        return state;
    }
  };
  
  export default paymentReducer;
  