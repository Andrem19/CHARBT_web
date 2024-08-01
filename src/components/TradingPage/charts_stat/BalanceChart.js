import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { biutyfyTOS } from "../../../services/services";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const BalanceChart = ({ positions }) => {
    let balance = 0;
    const data = positions.map(position => {
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

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const index = context.dataIndex;
                        const position = positions[index];
                        return [
                            `Balance: ${context.raw.toFixed(2)}`,
                            `Open Price: ${position.open_price ?? 0}`,
                            `Close Price: ${position.close_price ?? 0}`,
                            `Take Profit: ${position.take_profit ?? 0}`,
                            `Stop Loss: ${position.stop_loss ?? 0}`,
                            `Profit: ${position.profit.toFixed(2)}`,
                            `Amount: ${position.amount ?? 0}`,
                            `Target Length: ${position.target_len ?? 0}`,
                            `Type of Close: ${biutyfyTOS(position.type_of_close) ?? 0}`,
                            `Buy/Sell: ${position.buy_sell ?? 0}`
                        ];                        
                    }
                }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default BalanceChart;
