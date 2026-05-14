import { COIN_CRYPTO_SET, FOREX, STOCK } from "../config";

export function getPaymentStatus(user) {
    if (user.payment_status == 'default') {
        return 'default'
    } else if (user.subscription_to === 0) {
        return user.payment_status
    } else {
        var timestampInSeconds = Math.floor(Date.now() / 1000);
        if (user.subscription_to > timestampInSeconds) {
            return user.payment_status
        } else {
            return 'default'
        }
    }
}

export function getAvaliblePairs(user) {
    if (!user) {
        return [...COIN_CRYPTO_SET, ...STOCK, ...FOREX]
    }
    const paymentStatus = getPaymentStatus(user)
    if (paymentStatus === 'default') {
        return ['BTCUSDT']
    } else if (paymentStatus === 'essential') {
        return [
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'AAPL', 'EURUSD'
        ]
    } else if (paymentStatus === 'premium' || paymentStatus === 'premium-plus') {
        return [...COIN_CRYPTO_SET, ...STOCK, ...FOREX]
    }
}

export function getAvalibleTimeframes(user) {
    if (!user) {
        return ['1d', '1h', '30m', '5m', '1m']
    }
    const paymentStatus = getPaymentStatus(user)
    if (paymentStatus === 'default') {
        return ['1d']
    } else if (paymentStatus === 'essential') {
        return [
            '1d', '1h'
        ]
    } else if (paymentStatus === 'premium') {
        return [
            '1d', '1h', '30m'
        ]
    } else if (paymentStatus === 'premium-plus') {
        return [
            '1d', '1h', '30m', '5m', '1m'
        ]
    }
}