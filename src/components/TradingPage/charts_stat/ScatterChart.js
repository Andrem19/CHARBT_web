import React from "react";
import { Scatter } from 'react-chartjs-2';
import { Chart, ScatterController, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(ScatterController, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const ScatterChart = ({ positions }) => {
    const data = positions.map(position => ({
        x: (position.close_time - position.open_time) / 60, // переводим секунды в минуты 
        y: position.profit,
    }));

    const chartData = {
        datasets: [
            {
                label: 'Positions',
                data: data,
                backgroundColor: 'rgb(75, 192, 192)'
            }
        ]
    };

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Duration (minutes)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Profit'
                }
            }
        }
    };

    return <Scatter data={chartData} options={options} />;
};

export default ScatterChart;

