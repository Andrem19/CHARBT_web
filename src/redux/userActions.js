import axios from 'axios';
import { API_URL, PUB_URL } from '../config';
import { setShowTime, setPercPrice, setTpSl, setMarkersShow, setTimeframe, setPair, showPatterns, setShowTools } from './dataActions';
import { setCurrentSession, setSessionsList } from './sessionActions';
import { jwtExpired, encryptToken, decryptToken } from '../services/services'
import { TIME_CONVERT } from '../config';


async function loginUserApi(email, password) {
    try {
      const response = await axios.post(`${PUB_URL}/login`, {
        email,
        password
      });
      if (response.status === 200) {
        return {'result': true, 'data': response.data};
      } else if (response.status === 202) {
        return {'result': false, 'data': response.data};
      }
    } catch (error) {
      console.error('Error during login:', error);
      return {'result': false, 'data': 'Error during login:'};
    }
  }


  export const loginUser = (email, password, navigate) => {
    return async dispatch => {
      dispatch(loginStart());
      const response = await loginUserApi(email, password);
      if (response.result) {
        localStorage.setItem('jwt', response.data.jwt);
        dispatch(loginSuccess(response.data.data));
      } else {
        dispatch(loginFailure(response.data.data));
      }
    };
  };

  export function reloadUser(navigate) {
    return async dispatch => {
      dispatch(loginStart());
      const jwt = localStorage.getItem('jwt');
      
      if (!jwt || jwtExpired(jwt)) {
        dispatch(loginFailure('jwt expired'));
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.request({
          method: 'get',
          url: `${API_URL}/verify?details=all`,
          headers: {
              'Authorization': `Bearer ${jwt}`
          },
          validateStatus: function (status) {
            return true;
        },
        });
        if (response.status === 200) {
          dispatch(loginSuccess(response.data));
          dispatch(setCurrentSession(response.data.current_session))
          dispatch(setShowTime(response.data.settings.timeScale)) 
          dispatch(setPercPrice(response.data.settings.rightScale))
          dispatch(setTpSl(response.data.settings.showTpsl))
          dispatch(setMarkersShow(response.data.settings.showMarkers))
          dispatch(setSessionsList(response.data.sessions))
          dispatch(showPatterns(response.data.settings.showPatterns))
          dispatch(setShowTools(response.data.settings.showTools))
          dispatch(setTimeframe(TIME_CONVERT[response.data.current_session.timeframe]))
          dispatch(setPair(response.data.current_session.coin_pair))
          dispatch(setGlobalSettings(response.data.global_settings))
        } else {
          console.warn(`No user: ${response.status}`);
          localStorage.removeItem('jwt')
          dispatch(loginFailure(response.data.data));
          dispatch(setMsg('The authorization attempt failed. Your token is invalid or the user is not found. Log in to the resource again. In case of further problems, try deleting your browser cache or contact technical support.'))
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('jwt')
          navigate('/login');
          dispatch(loginFailure('error'));
        }
        dispatch(loginFailure('error'));
      }
    }
}

  export const updateBlogLastVisit = () => {
    return {
        type: 'UPDATE_BLOG_LAST_VISIT'
    };
  };
  
  export const loginStart = () => {
    return {
      type: 'LOGIN_START'
    };
  };
  
  export const loginSuccess = (user) => {
    return {
      type: 'LOGIN_SUCCESS',
      payload: user
    };
  };

  export const setIsMobile = (isMobile) => {
    return {
      type: 'SET_IS_MOBILE',
      payload: isMobile
    };
  };

  export const setGlobalSettings = (settings) => {
    return {
      type: 'SET_GLOBAL_SETTINGS',
      payload: settings
    };
  };
  
  export const loginFailure = (error) => {
    return {
      type: 'LOGIN_FAILURE',
      payload: error
    };
  };


  export const setError = (error) => {
    return {
      type: 'SET_ERROR',
      payload: error
    };
  };

  export const setMsg = (msg) => {
    return {
      type: 'SET_MSG',
      payload: msg
    };
  };
  export const resetMsg = () => {
    return {
      type: 'RESET_MSG'
    };
  };
  export const addSession = (session) => ({
    type: 'ADD_SESSION',
    payload: session
  });

  export const removeSession = (sessionId) => ({
      type: 'REMOVE_SESSION',
      payload: sessionId
  });

  export const addPosition = (sessionId, position) => ({
      type: 'ADD_POSITION',
      sessionId: sessionId,
      payload: position
  });

  export const removePosition = (sessionId, positionId) => ({
      type: 'REMOVE_POSITION',
      sessionId: sessionId,
      payload: positionId
  });