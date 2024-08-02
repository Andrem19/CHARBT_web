export const setCurrentPosition = (position) => ({
    type: 'SET_CURRENT_POSITION',
    payload: position,
  });

export const setCurrentSession = (session) => ({
    type: 'SET_CURRENT_SESSION',
    payload: session,
});

export const setCurrentSessionPnl = (pnl) => ({
    type: 'SET_CURRENT_SESSION_PNL',
    payload: pnl,
});
  
export const removeCurrentPosition = () => ({
    type: 'REMOVE_CURRENT_POSITION',
});

export const resetPositions = () => ({
    type: 'RESET_POSITIONS',
});

export const addPositionToSession = (position) => ({
    type: 'ADD_POSITION_TO_SESSION',
    payload: position,
});
export const setUuidCode = (code) => ({
    type: 'SET_UUID_CODE',
    payload: code,
});
    

export const setSessionsList = (sessions) => ({
    type: 'SET_SESSIONS_LIST',
    payload: sessions,
});
export const updateCurrentPnL = (newPnL) => {
    return {
        type: 'UPDATE_CURRENT_PNL',
        payload: newPnL,
    };
};

export const addSessionToList = (session) => ({
    type: 'ADD_SESSION_TO_LIST',
    payload: session,
});

export const removeOneSession = (id) => ({
    type: 'REMOVE_SESSION_FROM_LIST',
    payload: id,
  });
  