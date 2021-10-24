import React from "react";
import Chart from 'react-apexcharts'


class CandleStick extends React.Component {
    constructor(props) {
        super(props);
        console.log("props", props)
        this.state = {
            grid: {
                show: true
            },
            series: [{
                data: props.data
            }],
            options: {
                grid: {
                    show: false,

                },

                chart: {
                    type: 'candlestick',
                    height: 200,
                    background: "#121212"
                },
                title: {
                    text: 'CandleStick Chart',
                    align: 'left'
                },
                plotOptions: {
                    candlestick: {
                        colors: {
                            upward: '#0ecb81',
                            downward: '#ff0000'
                        }
                    },
                    wick: {
                        useFillColor: true,
                    }
                },
                xaxis: {
                    type: 'datetime',
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    show: false,
                    labels: {
                        show: false
                    },
                    tooltip: {
                        enabled: true
                    },

                }
            },


        };
    }
    render() {
        return (
            <div >
                <Chart options={this.state.options} series={this.state.series} type="candlestick" />
            </div>
        )
    }
}

export default CandleStick