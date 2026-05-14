import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const SellBuyChart = ({ positions }) => {
    const profits = {
        buy: { positive: 0, negative: 0 },
        sell: { positive: 0, negative: 0 }
    };

    positions.forEach(position => {
        if (position.profit > 0) {
            profits[position.buy_sell.toLowerCase()].positive++;
        } else {
            profits[position.buy_sell.toLowerCase()].negative++;
        }
    });

    const chartData = {
        labels: ['Buy', 'Sell'],
        datasets: [
            {
                label: 'Profit > 0',
                data: [profits.buy.positive, profits.sell.positive],
                backgroundColor: 'rgb(75, 192, 75)'
            },
            {
                label: 'Profit < 0',
                data: [profits.buy.negative, profits.sell.negative],
                backgroundColor: 'rgb(192, 75, 75)'
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default SellBuyChart;
