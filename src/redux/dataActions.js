import axios from 'axios';
import { API_URL, PUB_URL } from '../config';
import { setMsg } from './userActions';
import { getSelfData } from '../api/data';


async function loadListApi(coin, timeframe, finish_date) {
    try {
        const jwt = localStorage.getItem('jwt');
        let response = null
        if (jwt) {
        response = await axios.get(`${API_URL}/data?coin=${coin}&timeframe=${timeframe}&finish_date=${finish_date}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            },
            validateStatus: function (status) {
                return true; 
            }
        });
      } else {
        response = await axios.get(`${PUB_URL}/pub_data`, {
          validateStatus: function (status) {
              return true; 
          }
      });
      }

        if (response.status === 200) {
          
            const data = response.data.data.map(candle => ({
                time: new Date(new Date(candle[0]).toISOString()).valueOf() / 1000,
                open: candle[1],
                high: candle[2],
                low: candle[3],
                close: candle[4],
                volume: candle[5]
            }));
            
            let result = {'result': true, 'data': data};


            if ('add_data' in response.data) {
              result['add_data'] = response.data['add_data'].map(candle => ({
                  time: new Date(new Date(candle[0]).toISOString()).valueOf() / 1000,
                  open: candle[1],
                  high: candle[2],
                  low: candle[3],
                  close: candle[4],
                  volume: candle[5]
              }));
            }
            return result;
        } else {
            return {'result': false, 'data': response.data.data, 'message': response.data.message};
        }
    } catch (error) {
        console.error('Error during data loading:', error);
        return {'result': false, 'message': 'An error occurred during list loading.'};
    }
}

export const setNewPair = (coin, timeframe, finish_date, cursor) => {
  return async (dispatch, getState) => {
    dispatch(loadingStart())
    const response = await loadListApi(coin, timeframe, finish_date);
    dispatch(setCursor(cursor))
    if (response.result) {
      dispatch(loadListSuccess(response.data));
      if ('add_data' in response) {
        dispatch(setAddList(response.add_data))
      }
    } else {
      dispatch(loadListFailure(response.data));
    }
  };
};

export const setSelfData = (navigate, id, cursor) => {
  return async (dispatch, getState) => {
    dispatch(loadingStart())
    const response = await getSelfData(navigate, id);
    dispatch(setCursor(cursor))
    if (response.result) {
      dispatch(loadListSuccess(response.data));
    } else {
      dispatch(loadListFailure(response.data));
    }
  };
};
  

  export const loadList = (coin, timeframe, finish_date, cursor) => {
    return async (dispatch, getState) => {
      dispatch(loadingStart())
      dispatch(setCursor(cursor))
      const response = await loadListApi(coin, timeframe, finish_date);
      if (response.result) {
        const currentList = getState().data.list;
        if (currentList.length === 0) {
          dispatch(loadListSuccess(response.data));
          if ('add_data' in response) {
            dispatch(setAddList(response.add_data))
          }
        } else {
          const firstCandleTime = response.data[0].time;
          const isAllCandlesEarlier = currentList.every(candle => candle.time < firstCandleTime);
          if (isAllCandlesEarlier) {
            dispatch(setDataWasAdded(true));
            dispatch(addToList(response.data));
            if ('add_data' in response) {
              dispatch(setAddList(response.add_data))
            }
          }
        }
      } else {
        dispatch(loadListFailure(response.data));
        dispatch(setMsg(response.message))
      }
    };
  };


  
  export const loadingStart = () => {
    return {
      type: 'LOADING_START'
    };
  };

  export const setShowAddData = () => {
    return {
      type: 'SET_SHOW_ADD_DATA'
    };
  };

export const loadListSuccess = (list) => {
  return {
    type: 'LOAD_LIST_SUCCESS',
    payload: list
  };
};

export const setAddList = (list) => {
  return {
    type: 'SET_ADD_LIST',
    payload: list
  };
};
export const setList = (list) => {
  return {
    type: 'SET_LIST',
    payload: list
  };
};

export const loadListFailure = (error) => {
  return {
    type: 'LOAD_LIST_FAILURE',
    payload: error
  };
};

export const addToList = (newList) => {
  return {
    type: 'ADD_TO_LIST',
    payload: newList
  };
};

export const addScreenshot = (screenshot) => {
  return {
    type: 'ADD_SCREENSHOT',
    payload: screenshot
  };
};

export const setCursor = (cursor) => {
  return {
      type: 'SET_CURSOR',
      payload: cursor
  };
};
export const setPrevCursor = (cursor) => {
  return {
      type: 'SET_PREV_CURSOR',
      payload: cursor
  };
};
export const setWaitingCursor = (cursor) => {
  return {
      type: 'SET_WAITING_CURSOR',
      payload: cursor
  };
};

export const setPaymentPlans = (payment_plans) => {
  return {
      type: 'SET_PAYMENT_PLANS',
      payload: payment_plans
  };
};
export const addMarker = (marker) => {
  return {
      type: 'ADD_MARKER',
      payload: marker
  };
};

export const clearMarkers = () => {
  return {
      type: 'CLEAR_MARKERS'
  };
};

export const setShowTime = (showTime) => {
  return {
      type: 'SET_SHOW_TIME',
      payload: showTime
  };
};
export const setStopLossLine = (line) => ({
  type: 'SET_STOP_LOSS_LINE',
  payload: line,
});

export const setTakeProfitLine = (line) => ({
  type: 'SET_TAKE_PROFIT_LINE',
  payload: line,
});

export const resetStopLossLine = () => ({
  type: 'RESET_STOP_LOSS_LINE',
});

export const resetTakeProfitLine = () => ({
  type: 'RESET_TAKE_PROFIT_LINE',
});
export const setMarkersShow = (markersShow) => {
  return {
      type: 'SET_MARKERS',
      payload: markersShow
  };
};
export const setTpSl = (showTpsl) => {
  return {
      type: 'SET_TPSL',
      payload: showTpsl
  };
};
export const showPatterns = (showPatterns) => {
  return {
      type: 'SHOW_PATTERNS',
      payload: showPatterns
  };
};
export const setShowTools = (showTools) => {
  return {
      type: 'SHOW_TOOLS',
      payload: showTools
  };
};
export const setPercPrice = (percPrice) => {
  return {
      type: 'SET_PERC_PRICE',
      payload: percPrice
  };
};
export const setScreenshots = (screenshots) => {
  return {
      type: 'SET_SCREENSHOTS',
      payload: screenshots
  };
};

export const setDataWasAdded = (wasAdded) => {
  return {
      type: 'DATA_WAS_ADDED',
      payload: wasAdded
  };
};

export const setFiltred = (filtred) => {
  return {
      type: 'SET_FILTRED',
      payload: filtred
  };
};


export const setPair = (new_pair) => {
  return {
      type: 'SET_PAIR',
      payload: new_pair
  };
};

export const setTimeframe = (timeframe) => {
  return {
      type: 'SET_TIMEFRAME',
      payload: timeframe
  };
};

export const toggleTheme = () => {
  return {
      type: 'TOGGLE_THEME'
  };
};