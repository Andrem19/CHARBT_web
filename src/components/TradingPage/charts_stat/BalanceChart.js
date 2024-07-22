import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);


const BalanceChart = ({ positions }) => {
    let balance = 0;
    const data = positions.map(position => {
        console.log(position.profit)
        balance += position.profit;
        return balance;
    });


    const chartData = {
        labels: positions.map((_, index) => index + 1),
        datasets: [
            {
                label: 'Balance',
                data: data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return <Line data={chartData} />;
};

export default BalanceChart;
