import axios from 'axios';
import React from 'react'
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../context';
import { Line } from "react-chartjs-2";
import { Button, CircularProgress, Grid } from '@mui/material';
import chartDays from '../config/data';
import Graph from './Graph';
import CandleStick from '../components/CandelStick';


const Chart = ({ id, current }) => {
    const [historicData, setData] = React.useState();
    const [marketCap, setMarketCap] = React.useState();
    const [days, setDays] = React.useState(1);
    const [loading, setLoading] = React.useState(false)
    const [average, setAverage] = React.useState(0);
    const { currency } = CryptoState();
    const [ohlc, setOlch] = React.useState();


    const fetchData = async () => {
        setLoading(true)
        const { data } = await axios.get(HistoricalChart(id, days, currency));
        setData(data.prices);
        setMarketCap(data.market_caps);
        const ohlcData = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=${currency.toLowerCase()}&days=${days}`)
        setOlch(ohlcData.data);
        let sum = 0;
        data.prices.map(e => {
            return sum += e[1];
        })
        setAverage(sum / data.prices.length);
        setLoading(false)
    }
    const numFormatter = (num) => {
        if (num > 999 && num < 1000000) {
            return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
        } else if (num > 1000000) {
            return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
        } else if (num < 900) {
            return num; // if value < 1000, nothing to do
        }
    }
    React.useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [currency, days])
    return (
        <>
            <div style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                maxWidth: "500px"

            }}>
                {chartDays.map(e => {
                    return <Button key={e.value} size="small" value={e.value} onClick={(e) => setDays(parseInt(e.target.value))}
                        variant={e.value === days ? "contained" : "text"}
                    >{e.label}</Button>
                })}
            </div>

            <Grid item lg={12} md={12} xs={12}>
                {loading ? <CircularProgress style={{
                    display: "flex",
                    margin: "50px auto",
                    justifyContent: "center",
                    textAlign: "center",

                }} /> : <></>}
                {!loading && historicData && <Graph
                    historicData={historicData}
                    days={days} currency={currency}
                    average={average} />}
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
                {loading ? <CircularProgress style={{
                    display: "flex",
                    margin: "50px auto",
                    justifyContent: "center",
                    textAlign: "center",

                }} /> : <></>}
                {!loading && ohlc && <CandleStick data={ohlc} />}
            </Grid>
            <Grid item lg={12} md={12} xs={12}>
                {loading ? <CircularProgress style={{
                    display: "flex",
                    margin: "50px auto",
                    justifyContent: "center",
                    textAlign: "center",
                }} /> : <></>}
                {!loading && marketCap && <Line
                    data={{
                        labels: marketCap.map((coin) => {
                            let date = new Date(coin[0]);
                            let time = date.getHours();
                            return days === 1 ? time : date.toLocaleDateString();
                        }),

                        datasets: [
                            {
                                data: marketCap.map((coin) => coin[1]),
                                label: `Market Cap ( Past ${days} Days ) in ${currency}`,
                                borderColor: "#a3d2ff",
                            },
                        ],
                    }}
                    options={{

                        elements: {
                            point: {
                                radius: 0.5,
                            },
                        }, scales: {
                            yAxes: {
                                ticks: {
                                    callback: function (value, index, values) {
                                        return numFormatter(value);
                                    }
                                }
                            }
                        }
                    }}
                />}
            </Grid>

        </>
    )
}

export default Chart
