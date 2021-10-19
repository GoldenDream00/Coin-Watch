import React from 'react'
import { Line } from "react-chartjs-2";


const ChartGraph = ({ sparkline: historicData, change }) => {
    return (
        <Line
            data={{
                labels: historicData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time = date.getHours();
                    return date.toLocaleDateString();
                }),

                datasets: [
                    {
                        showLines: true,
                        borderWidth: 1,
                        data: historicData,
                        borderColor: change > 0 ? "rgb(14, 203, 129)" : "#ed5565"
                    },
                ]
            }}
            options={{
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }, scales: {
                    y: {
                        display: false
                    }, x: {
                        display: false,
                    }
                }, tooltips: {
                    enabled: false
                }
            }}
        />
    )
}

export default ChartGraph
