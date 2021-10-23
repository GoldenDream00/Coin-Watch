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
                        borderWidth: 0.2,
                        data: historicData.map((coin) => coin[1]),
                        label: `Price ( Past ${days} Days ) in ${currency}`,
                        borderColor: "rgb(173,181,189,1)",
                        backgroundColor: historicData.map(c => {
                            return c[1] > average ? "rgb(14, 203, 129)" : "red";
                        }),

                    },
                ], tension: 0.1
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
                        }, grid: {
                            display: true,
                            color: "rgb(173,181,189,0.2)"
                        }
                    }
                }
            }}
        />
    )
}

export default Graph
