
const initialState = {
    loading: false,
    list: [],
    add_list: [],
    error: null,
    cursor: null,
    theme: localStorage.getItem('theme') || 'light',
    current_pair: 'BTCUSDT',
    timeframe: '1d',
    screenshots: [],
    markers: [],
    stopLossLine: null,
    takeProfitLine: null,
    filttred_screenshots: [],
    payment_plans: null,
    showTime: false,
    percPrice: false,
    showMarkers: false,
    showTpsl: false,
    showPatterns: false,
    dataWasAdded: false,
    showAddData: false,
};
  
const listReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'LOADING_START':
            return {
                ...state,
                loading: true,
            };
        case 'SET_SHOW_TIME':
            return {
                ...state,
                showTime: action.payload,
            };
        case 'SET_PERC_PRICE':
            return {
                ...state,
                percPrice: action.payload,
            };
        case 'SET_SHOW_ADD_DATA':
            return {
                ...state,
                showAddData: !state.showAddData,
            };
        case 'DATA_WAS_ADDED':
            return {
                ...state,
                dataWasAdded: action.payload,
            };
        case 'SET_MARKERS':
            return {
                ...state,
                showMarkers: action.payload,
            };
        case 'SHOW_PATTERNS':
            return {
                ...state,
                showPatterns: action.payload,
            };
        case 'SET_ADD_LIST':
            return {
                ...state,
                add_list: action.payload,
            };
        case 'SET_TPSL':
            return {
                ...state,
                showTpsl: action.payload,
            };
        case 'SET_STOP_LOSS_LINE':
            return {
                ...state,
                stopLossLine: action.payload,
            };
        case 'SET_TAKE_PROFIT_LINE':
            return {
                ...state,
                takeProfitLine: action.payload,
            };
        case 'RESET_STOP_LOSS_LINE':
            return {
                ...state,
                stopLossLine: null,
            };
        case 'RESET_TAKE_PROFIT_LINE':
            return {
                ...state,
                takeProfitLine: null,
            };
        case 'LOAD_LIST_SUCCESS':
            return {
                ...state,
                loading: false,
                list: action.payload,
                error: null
            };
        case 'ADD_MARKER':
            return {
                ...state,
                markers: [...state.markers, action.payload],
            };
        case 'CLEAR_MARKERS':
            return {
                ...state,
                markers: [],
            };
        case 'LOAD_LIST_FAILURE':
            return {
                ...state,
                loading: false,
                list: [],
                error: action.payload
            };
        case 'ADD_TO_LIST':
            return {
                ...state,
                list: [...state.list, ...action.payload],
                loading: false,
            };
        case 'ADD_SCREENSHOT':
            return {
                ...state,
                screenshots: [...state.screenshots, ...action.payload]
            };
        case 'SET_SCREENSHOTS':
            return {
                ...state,
                screenshots: action.payload,
                loading: false,
            };
        case 'SET_FILTRED':
            return {
                ...state,
                filttred_screenshots: action.payload,
            };
        case 'SET_CURSOR':
            return {
                ...state,
                cursor: action.payload
            };
        case 'SET_PAIR':
            return {
                ...state,
                current_pair: action.payload
            };
        case 'SET_TIMEFRAME':
            return {
                ...state,
                timeframe: action.payload
            };
        case 'TOGGLE_THEME':
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return {
                ...state,
                theme: newTheme
            };
        case 'SET_PAYMENT_PLANS':
            return {
                ...state,
                payment_plans: action.payload
            };
        default:
            return state;
    }
};
  
export default listReducer;
