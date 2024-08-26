

export function createPosition(user_id, timeframe, target_len, amount, buy_sell, open_price, open_time, coin_pair, session_id, take_profit = 0, stop_loss = 0) {
    return {
        id: null,
        session_id: session_id,
        user_id: user_id,
        coin_pair: coin_pair,
        open_price: open_price,
        close_price: null,
        take_profit: take_profit,
        stop_loss: stop_loss,
        profit: 0,
        open_time: open_time,
        close_time: null,
        timeframe: timeframe,
        volatility: 0,
        amount: amount,
        target_len: target_len,
        type_of_close: null,
        buy_sell: buy_sell,
        data_ident: '',
        add_info: ''
    };
}

export function calculateProfit(amount, open_price, current_price, buy_sell) {
    let pnl = 0;
    let quantity = amount / open_price;
    let current_value = quantity * current_price;

    if (buy_sell === 'Buy') {
        pnl = current_value - amount;
    } else if (buy_sell === 'Sell') {
        pnl = amount - current_value;
    }

    return pnl;
}

export function checkStopLoss(stopLoss, currentPrice, buy_sell) {
    if (buy_sell === 'Buy') {
        if (currentPrice <= stopLoss) {
            return true
        } else {
            return false
        }
    } else if (buy_sell === 'Sell') {
        if (currentPrice >= stopLoss) {
            return true
        } else {
            return false
        }
    }
}
export function checkTakeProfit(takeProfit, currentPrice, buy_sell) {
    if (buy_sell === 'Buy') {
        if (currentPrice >= takeProfit) {
            return true
        } else {
            return false
        }
    } else if (buy_sell === 'Sell') {
        if (currentPrice <= takeProfit) {
            return true
        } else {
            return false
        }
    }
}

export function checkBalance(pnl, balance) {
    if (balance+pnl <= 0) {
        return true
    }
    return false
}

export function getColor(theme, profit) {
    if (profit > 0) {
        return 'green'
    } else if (profit < 0) {
        return 'red'
    } else if (profit === 0) {
        if (theme === 'light') {
            return 'black'
        } else if (theme === 'dark') {
            return 'white'
        }
    }
}

export function checkTP(take_profit, current_price, buy_sell) {
    if (buy_sell === 'Buy') {
        if (take_profit <= current_price || take_profit > current_price * 1.10) {
            return false
        }
    } else if (buy_sell === 'Sell') {
        if (take_profit >= current_price || take_profit < current_price * 0.90) {
            return false
        }
    }
    return true
}

export function checkSL(stop_loss, current_price, buy_sell) {
    if (buy_sell === 'Buy') {
        if (stop_loss >= current_price || stop_loss < current_price * 0.90) {
            return false
        }
    } else if (buy_sell === 'Sell') {
        if (stop_loss <= current_price || stop_loss > current_price * 1.10) {
            return false
        }
    }
    return true
}

export function getVolatility(timeframe_m, last_5candle) {
    let volatility = 0;
    if (timeframe_m === '1m') {
        let high = Math.max(...last_5candle.map(candle => candle.high));
        let low = Math.min(...last_5candle.map(candle => candle.low));
        let open = last_5candle[0].open;
        volatility = ((high - low) / open) * 100;
    } else if (timeframe_m === '5m') {
        let lastCandle = last_5candle[last_5candle.length - 1];
        volatility = ((lastCandle.high - lastCandle.low) / lastCandle.open) * 100;
    }
    return volatility;
}

export function convertPercentToPrice(currentPrice, TpPerc, SlPerc, side, afterDot) {
    let result = {};
    TpPerc = TpPerc !== null ? parseFloat(TpPerc) : null;
    SlPerc = SlPerc !== null ? parseFloat(SlPerc) : null;

    if (TpPerc !== null) {
        result['tp'] = side === 'Buy' ? currentPrice * (1 + (TpPerc / 100)) : currentPrice * (1 - (TpPerc / 100));
        result['tp'] = parseFloat(result['tp'].toFixed(afterDot));
    } else {
        result['tp'] = null;
    }

    if (SlPerc !== null) {
        result['sl'] = side === 'Buy' ? currentPrice * (1 - (SlPerc / 100)) : currentPrice * (1 + (SlPerc / 100));
        result['sl'] = parseFloat(result['sl'].toFixed(afterDot));
    } else {
        result['sl'] = null;
    }

    return result;
}

