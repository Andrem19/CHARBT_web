import { v4 as uuidv4 } from 'uuid';

const initialState = {
    sessions_list: null,
    curent_session: null,
    curent_session_pnl: 0,
    current_position: null,
    uuidCode: uuidv4()
  };

  const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_CURRENT_POSITION':
        return {
          ...state,
          current_position: action.payload,
        };
      case 'SET_UUID_CODE':
        return {
          ...state,
          uuidCode: action.payload,
        };
      case 'SET_CURRENT_SESSION':
        return {
            ...state,
            curent_session: {
              ...action.payload,
              positions: action.payload.positions || [] 
          },
        };
      case 'SET_CURRENT_SESSION_PNL':
        return {
            ...state,
            curent_session_pnl: action.payload,
        };
      case 'UPDATE_CURRENT_PNL':
        return {
            ...state,
            curent_session: {
                ...state.curent_session,
                current_PnL: action.payload,
            },
        };
      case 'REMOVE_CURRENT_POSITION':
        return {
          ...state,
          current_position: null,
        };
      case 'ADD_POSITION_TO_SESSION':
        const existingPosition = state.curent_session.positions.find(pos => pos.id === action.payload.id);
        if (existingPosition) {
            return state; // Если позиция уже существует, не добавляем её снова
        }
        return {
            ...state,
            curent_session: {
                ...state.curent_session,
                positions: [...state.curent_session.positions, action.payload]
            }
        };
      
      case 'SET_SESSIONS_LIST':
        return {
            ...state,
            sessions_list: action.payload,
        };
      case 'ADD_SESSION_TO_LIST':
        return {
            ...state,
            sessions_list: [...state.sessions_list, action.payload],
        };
      case 'REMOVE_SESSION_FROM_LIST':
        return {
            ...state,
            sessions_list: state.sessions_list.filter(session => session.id !== action.payload),
        };
      default:
        return state;
    }
  };

  export default sessionReducer;