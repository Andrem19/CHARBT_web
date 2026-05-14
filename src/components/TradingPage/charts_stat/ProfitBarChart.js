import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const ProfitBarChart = ({ positions }) => {
    const data = positions.map(position => position.profit);
    const backgroundColors = data.map(profit => profit >= 0 ? 'rgb(75, 192, 75)' : 'rgb(192, 75, 75)');

    const chartData = {
        labels: positions.map((_, index) => (index + 1)),
        datasets: [
            {
                label: 'Profit',
                data: data,
                backgroundColor: backgroundColors
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

export default ProfitBarChart;
