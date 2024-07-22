export const API_URL = 'http://localhost:5000/api';
export const PUB_URL = 'http://localhost:5000/pub';
export const WEB_URL = 'http://localhost:3000';
export const SCREENSHOT_COLLECTION = 'https://charbtmarketdata.s3.amazonaws.com/SCREENSHOT_COLLECTION'

export const secret_key = 'Hgf7Nk*kjHGT74DF'

export const TIME_CONVERT = {
    1: '1m',
    5: '5m',
    15: '15m',
    30: '30m',
    60: '1h',
    1440: '1d',
}
export const TIME_CONVERT_REVERSED = {
    '1m': 1,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '1d': 1440,
}

export const TIMEFRAMES = [
    '1m',
    '5m',
    '30m',
    '1h',
    '1d',
]

export const COIN_CRYPTO_SET = [
    'ADAUSDT',
    'BNBUSDT',
    'BTCUSDT',
    'DOTUSDT',
    'DOGEUSDT',
    'ETHUSDT',
    'LINKUSDT',
    'LTCUSDT',
    'MATICUSDT',
    'SOLUSDT',
    'XRPUSDT',
]

export const STOCK = [
    'AAPL', 
    'AMZN', 
    'TSLA', 
    'GOOGL', 
    'MSFT', 
]

export const FOREX = [
    'EURUSD', 
    'USDJPY', 
    'GBPUSD', 
    'USDCHF', 
    'AUDUSD'
]
export const tradingPairs = {
    // Криптовалютные пары
    'ADAUSDT': 4,
    'BNBUSDT': 3,
    'BTCUSDT': 2,
    'DOTUSDT': 3,
    'DOGEUSDT': 6,
    'ETHUSDT': 2,
    'LINKUSDT': 3,
    'LTCUSDT': 2,
    'MATICUSDT': 4,
    'SOLUSDT': 3,
    'XRPUSDT': 4,

    // Акции
    'AAPL': 2, 
    'AMZN': 2, 
    'TSLA': 2, 
    'GOOGL': 2, 
    'MSFT': 2, 

    // Валютные пары
    'EURUSD': 4, 
    'USDJPY': 3, 
    'GBPUSD': 4, 
    'USDCHF': 4, 
    'AUDUSD': 4
}
export const STRIPE_KEY='pk_test_51PXPAJJlOCgKlIIvREJR6hnBI7G8CmG466JGA17egI8aLSfL0cAnbkrdZ7QNHjT5q1a4c1rV4l4Bt1VRRQ7C2PHb0003Ddd0Hn'