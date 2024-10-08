import { API_URL } from "../config";
import axios from 'axios';

export function filterFiles(files, searchString) {
    return files.filter(file => {
        // Получаем только имя файла
        let filename = file.split('/').pop();
        filename = filename.toLowerCase();
        searchString = searchString.toLowerCase();
        // Возвращаем только файлы, которые содержат searchString в имени файла
        return filename.includes(searchString);
    });
}

export async function apiRequest(navigate, method, url, data = {}, headers = {}, params = {}) {
    const jwt = localStorage.getItem('jwt');
    
    if (!jwt || jwtExpired(jwt)) {
        navigate('/login');
        return;
    }

    headers['Authorization'] = `Bearer ${jwt}`;

    const isFormData = url === '/upload_screenshot' || url === '/set_avatar';

    try {
        const uri = API_URL + url
        const response = await axios.request({
            method: method,
            url: uri,
            data: isFormData ? data : data,
            headers: headers,
            params: params,
            validateStatus: function (status) {
                return true;
            },
        });
        if (response.status === 407) {
            console.log('Error 407: Unauthorized');
            window.localStorage.removeItem('jwt')
            window.location.reload(true);
            return response;
        }
        return response;
    } catch (error) {
        console.error('API request failed', error);
        return null;
    }
}





export function convertToDates(list) {
    return list.map(item => {
        if (!item.hasOwnProperty('time')) {
            console.error('Missing time property:', item);
            return item;
        }
        const date = new Date(item.time);
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', item.time);
            return item;
        }
        return {
            ...item,
            time: date
        };
    });
}

export function convertToUnixTime(list) {
    return list.map(item => ({
        ...item,
        time: Math.floor(new Date(item.time).getTime() / 1000)
    }));
}

export function jwtExpired(jwt) {
    const [header, payload, signature] = jwt.split('.');
    
    const decodedPayload = JSON.parse(atob(payload));
    
    // Получаем текущее время в секундах
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Проверяем, истек ли срок действия JWT
    if (decodedPayload.exp < currentTime) {
      return true;
    }
    
    return false;
  }

  export function createCandle(data, index, timeframe) {
    const ONE_HOUR = 60 * 60;
    const ONE_DAY = 24 * ONE_HOUR;

    let period;

    if (timeframe === 1440) {
        period = ONE_DAY;
    } else if (timeframe === 60) {
        period = ONE_HOUR;
    } else {
        throw new Error('Invalid timeframe');
    }

    const endTime = data[index].time;
    let nd = new Date(endTime*1000)
    const startTime = endTime - (endTime % period);
    let sd = new Date(startTime*1000)
    const candles = data.filter(candle => candle.time >= startTime && candle.time <= endTime);
    const open = candles[0].open;
    const close = candles[candles.length - 1].close;

    let high = -Infinity;
    let low = Infinity;
    let volume = 0;

    for (let i = 0; i < candles.length; i++) {
        high = Math.max(high, candles[i].high);
        low = Math.min(low, candles[i].low);
        volume += candles[i].volume;
    }

    return {
        time: startTime,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: volume
    };
}

export function findClosestTimestampIndex(list, targetTimestamp) {
    let closestIndex = -1;
    let closestDiff = Infinity;

    for (let i = 0; i < list.length; i++) {
        let diff = targetTimestamp - list[i].time;
        if (diff >= 0 && diff < closestDiff) {
            closestDiff = diff;
            closestIndex = i;
        }
    }

    return closestIndex;
}


export const convertTimeframe = (time) => {
    const times = {
        '1m': 1,
        '5m': 5,
        '30m': 30,
        '1h': 60,
        '1d': 1440,
    }
    return times[time]
}

export const countSessionStatistic = (positions) => {
    if (!positions || positions.length === 0) {
        return {
            successPositionPercent: 0,
            averageProfit: 0,
            averageLoss: 0,
            averageDuration: '',
            profitCount: 0,
            lossCount: 0,
            sumProfit: 0,
            sumLoss: 0,
            autoClose: 0,
            takeProfitClose: 0,
            stopLossClose: 0,
            manualClose: 0,
            pnl: 0,
            sell: 0,
            buy: 0,
            }
    }
    
    let stats = {
        averageDuration: '',
        profitCount: 0,
        lossCount: 0,
        sumProfit: 0,
        sumLoss: 0,
        autoClose: 0,
        takeProfitClose: 0,
        stopLossClose: 0,
        manualClose: 0,
        pnl: 0,
        sell: 0,
        buy: 0,
    };
    let totalDuration = 0;
    let count = positions.length;

    positions.forEach(position => {
        if (!position || !position.profit || !position.type_of_close) {
            return;
        }
        let duration = position.close_time - position.open_time;
        totalDuration += duration;

        let profit = position.profit;
        stats.pnl += profit;

        if (profit > 0) {
            stats.profitCount++;
            stats.sumProfit += profit;
        } else {
            stats.lossCount++;
            stats.sumLoss += profit;
        }

        switch (position.type_of_close) {
            case 'auto_close':
                stats.autoClose++;
                break;
            case 'take_profit':
                stats.takeProfitClose++;
                break;
            case 'stop_loss':
                stats.stopLossClose++;
                break;
            case 'manual':
                stats.manualClose++;
                break;
            default:
                break;
        }
        if (position.buy_sell == 'Buy') {
            stats.buy++
        } else if (position.buy_sell == 'Sell') {
            stats.sell++
        }
    });

    let averageDuration = totalDuration / count;
    stats.averageDuration = formatDuration(averageDuration);

    let totalPositions = positions.length;
    let successPositionPercent = (stats.profitCount && totalPositions) ? (stats.profitCount / totalPositions) * 100 : 0;


    let averageProfit = stats.profitCount ? stats.sumProfit / stats.profitCount : 0;
    let averageLoss = stats.lossCount ? stats.sumLoss / stats.lossCount : 0;

    return {
        successPositionPercent,
        averageProfit,
        averageLoss,
        ...stats,
    };
};

function formatDuration(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds % 60);
    seconds %= 60;
  
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (seconds > 0) result += `${seconds}s`;
  
    return result.trim();
  }

export function convertTimestamp(timestamp, timeframe) {
    let date = new Date(timestamp * 1000);
    let day = ("0" + date.getUTCDate()).slice(-2);
    let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    let year = date.getUTCFullYear().toString().substr(-2);

    if (timeframe === '1d') {
        return day + '/' + month + '/' + year;
    } else {
        let hours = ("0" + date.getUTCHours()).slice(-2);
        let minutes = ("0" + date.getUTCMinutes()).slice(-2);
        return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
    }
}


export const validateUsername = (username) => {
    return username.length <= 30;
  }

export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return re.test(String(email).toLowerCase());
}

export const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    return re.test(password);
}

export const biutyfyTOS = (tos) => {
    switch (tos) {
        case 'auto_close':
            return 'Auto Close'
        case 'take_profit':
            return 'Take Profit'
        case 'stop_loss':
            return 'Stop Loss'
        case 'manual':
            return 'Manual'
        default:
            break;
    }
}

export const showNewPost = (blogLastVisit, blogLastPost) => {
    const dateLastVisit = new Date(blogLastVisit);
    const dateLastPost = new Date(blogLastPost);
    const result = dateLastPost > dateLastVisit
    return result;
}

export function getDefaultSessionData() {
    return {
        id: 0,
        decimal_places: 2,
        selfDataId: null,
        is_self_data: false,
        pos_count: 0,
        session_name: 'TestSession',
        coin_pair: 'BTCUSDT',
        timeframe: '1d',
        additional_timeframe: '1d',
        cursor: 100,
        balance: 5000,
        current_PnL: 0.0,
        positions: []
    };
}