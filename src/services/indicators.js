export function calculateMA(data, period) {
    let sma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period) {
            sma[i] = null;
        } else {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            sma[i] = sum / period;
        }
    }
    return sma;
}

export function calculateRSI(data, period) {
    let changes = [];
    for (let i = 1; i < data.length; i++) {
        changes[i] = data[i].close - data[i - 1].close;
    }

    let avgGain = [], avgLoss = [];
    for (let i = 0; i < changes.length; i++) {
        if (i < period) {
            avgGain[i] = null;
            avgLoss[i] = null;
        } else if (i === period) {
            avgGain[i] = changes.slice(1, period + 1).filter(x => x > 0).reduce((a, b) => a + b, 0) / period;
            avgLoss[i] = changes.slice(1, period + 1).filter(x => x < 0).reduce((a, b) => a - b, 0) / period;
        } else {
            if (changes[i] >= 0) {
                avgGain[i] = (avgGain[i - 1] * (period - 1) + changes[i]) / period;
                avgLoss[i] = avgLoss[i - 1] * (period - 1) / period;
            } else {
                avgGain[i] = avgGain[i - 1] * (period - 1) / period;
                avgLoss[i] = (avgLoss[i - 1] * (period - 1) - changes[i]) / period;
            }
        }
    }

    let rsi = [];
    for (let i = 0; i < data.length; i++) {
        if (avgGain[i] === null || avgLoss[i] === null) {
            rsi[i] = null;
        } else if (avgLoss[i] === 0) {
            rsi[i] = 100;
        } else {
            rsi[i] = 100 - (100 / (1 + avgGain[i] / avgLoss[i]));
        }
    }
    return rsi;
}

export function calculateBollingerBands(list, N = 14, K = 2) {
    const sma = list.map((item, index, arr) => {
        if (index < N) {
            return null; 
        }
        const slice = arr.slice(index - N, index);
        const sum = slice.reduce((a, b) => a + b.close, 0);
        return sum / N;
    });

    const stdDev = list.map((item, index, arr) => {
        if (index < N) {
            return null;
        }
        const slice = arr.slice(index - N, index);
        const mean = sma[index];
        const variance = slice.reduce((a, b) => a + Math.pow(b.close - mean, 2), 0) / N;
        return Math.sqrt(variance);
    });

    const upperBand = sma.map((item, index) => item + stdDev[index] * K);
    const lowerBand = sma.map((item, index) => item - stdDev[index] * K);

    return {
        sma: sma,
        upperBand: upperBand,
        lowerBand: lowerBand,
    };
}


