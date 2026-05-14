const initialState = {
    loading: false,
    user: null,
    error: null,
    isLoggedIn: false,
    errorCount: 0,
    msg: null,
    globalSettings: null,
    isMobile: false,
    screenSize: 0
  };
  
  const userReducer = (state = initialState, action) => {
    switch(action.type) {
      case 'LOGIN_START':
        return {
          ...state,
          loading: true
        };
      case 'SET_IS_MOBILE':
        return {
          ...state,
          isMobile: action.payload
        };
      case 'UPDATE_BLOG_LAST_VISIT':
        return {
          ...state,
          user: {
            ...state.user,
            blogLastVisit: new Date().toUTCString()
          }
        };
      case 'RESET_USER':
        return {
          ...state,
          user: null
        };
      case 'RESET_MSG':
        return {
          ...state,
          msg: null
        };
      case 'SET_MSG':
        return {
          ...state,
          msg: action.payload
        };
      case 'SET_SCREEN':
        return {
          ...state,
          screenSize: action.payload
        };
      case 'SET_GLOBAL_SETTINGS':
        return {
          ...state,
          globalSettings: action.payload
        };
      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload
        };
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          loading: false,
          user: action.payload,
          error: null,
          isLoggedIn: true,
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          loading: false,
          user: null,
          error: action.payload,
          errorCount: state.errorCount + 1,
        };
      case 'ADD_SESSION':
        return {
            ...state,
            user: {
                ...state.user,
                sessions: [...state.user.sessions, action.payload]
            }
        };
      case 'REMOVE_SESSION':
          return {
              ...state,
              user: {
                  ...state.user,
                  sessions: state.user.sessions.filter(session => session.id !== action.payload)
              }
          };
      case 'ADD_POSITION':
          return {
              ...state,
              user: {
                  ...state.user,
                  sessions: state.user.sessions.map(session => 
                      session.id === action.sessionId 
                      ? {...session, positions: [...session.positions, action.payload]} 
                      : session
                  )
              }
          };
      case 'REMOVE_POSITION':
          return {
              ...state,
              user: {
                  ...state.user,
                  sessions: state.user.sessions.map(session => 
                      session.id === action.sessionId 
                      ? {...session, positions: session.positions.filter(position => position.id !== action.payload)} 
                      : session
                  )
              }
          };
      default:
        return state;
    }
  };
  
  export default userReducer;
  