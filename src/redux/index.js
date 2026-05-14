import { combineReducers } from 'redux';
import userReducer from './userReducer';
import listReducer from './dataReducer';
import sessionReducer from './sessionReducer';
import paymentReducer from './paymentReducer';

const rootReducer = combineReducers({
  user: userReducer,
  data: listReducer,
  session: sessionReducer,
  payment: paymentReducer,
});

export default rootReducer;