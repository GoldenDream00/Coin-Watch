import React from 'react';
import { Line } from "react-chartjs-2";


const Graph = ({ historicData, days, currency, average }) => {
    const numFormatter = (num) => {
        if (num > 999 && num < 1000000) {
            return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
        } else if (num > 1000000) {
            return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
        } else if (num < 900) {
            return num; // if value < 1000, nothing to do
        }
    }
    return (
        <Line
            data={{
                labels: historicData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time = date.getHours();
                    return days === 1 ? time + "H" : date.toLocaleDateString();
                }),

                datasets: [
                    {
                        showLines: true,
                        borderWidth: 1,
                        data: historicData.map((coin) => coin[1]),
                        label: `Price ( Past ${days} Days ) in ${currency}`,
                        backgroundColor: historicData.map(c => {
                            return c[1] > average ? "#a3d2ff" : "red";
                        }),
                    },
                ], tension: 0.5
            }}
            options={{
                elements: {
                    point: {
                        radius: 2,
                    },
                }, scales: {
                    y: {
                        ticks: {
                            callback: function (value, index, values) {
                                return numFormatter(value);
                            }
                        }
                    }
                }
            }}
        />
    )
}

export default Graph
