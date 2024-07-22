import React, { useEffect } from "react";
import { Doughnut } from 'react-chartjs-2';
import { biutyfyTOS } from "../../../services/services";
import { Chart, DoughnutController, ArcElement, CategoryScale, LinearScale, Title } from 'chart.js';

Chart.register(DoughnutController, ArcElement, CategoryScale, LinearScale, Title);

const CloseTypePieChart = ({ positions }) => {

    useEffect(() => {
        console.log('POSITIONS', positions)
    }, []);

    const closeTypes = positions.reduce((acc, position) => {
        acc[position.type_of_close] = (acc[position.type_of_close] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(closeTypes);
    const data = labels.map(label => closeTypes[label]);

    const colors = {
        'auto_close': '#FF6384',
        'take_profit': '#36A2EB',
        'stop_loss': '#FFCE56',
        'manual': '#4BC0C0'
    };

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: labels.map(label => colors[label])
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Types of Close'
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(tooltipItem) {
                        const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((tooltipItem.parsed / total) * 100).toFixed(2) + '%';
                        return `Type of Close: ${tooltipItem.label}, Percentage: ${percentage}`;
                    }
                }
            }
        }
    };

    const total = data.reduce((acc, val) => acc + val, 0);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '50%' }}>
                <Doughnut data={chartData} options={options} />
            </div>
            <div>
                {labels.map((label, index) => {
                    const percentage = ((data[index] / total) * 100).toFixed(2) + '%';
                    return (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: colors[label], marginRight: '10px' }}></div>
                            <div>{biutyfyTOS(label)}: {percentage}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CloseTypePieChart;
