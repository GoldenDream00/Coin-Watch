import React, { useState, useEffect } from 'react';
import {
    Container, Chip, ThemeProvider, createTheme,
    LinearProgress, Typography,
    Grid,
    Breadcrumbs,
} from "@mui/material";
import { Link, useParams } from 'react-router-dom';
import { SingleCoin } from '../config/api';
import axios from "axios";
import { makeStyles } from "@mui/styles"
import { CryptoState } from '../context';
import Chart from '../components/Chart';
import Sidebar from '../components/Sidebar';
import image from "../download.png"

const useStyles = makeStyles(() => ({
    container: {
        marginTop: 30,
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        padding: 10,
        color: 'white',
        backgroundColor: "#121212",
        fontSize: 50,
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",

    }, progressBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    }, dataRow: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 20,
        borderBottom: "0.5px solid #787e87",
    }, title: {
        color: "#787e87",
    }

}))

const Coin = () => {
    const { currency, symbol } = CryptoState();
    const classes = useStyles();
    const { id } = useParams();
    const [coin, setCoin] = useState();
    const [loading, setLoading] = useState(false)
    const fetchData = async () => {
        setLoading(true);
        const { data } = await axios.get(SingleCoin(id));
        setCoin(data);
        document.title = "Coinwatch " + data.name;
        setLoading(false)
    }
    function numberWithCommas(x) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return null
        }
    }
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    useEffect(() => {
        fetchData();
        //eslint-disable-next-line
    }, [])

    const value = ((coin?.market_data.current_price[currency.toLowerCase()] -
        coin?.market_data.low_24h[currency.toLowerCase()]) / (coin?.market_data.high_24h[currency.toLowerCase()]
            - coin?.market_data.low_24h[currency.toLowerCase()])) * 100
    return (
        <ThemeProvider theme={darkTheme}>
            <Container className="container">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link style={{ color: "#1db954" }} underline="hover" color="inherit" to="/">
                        Coins
                    </Link>
                    <Typography color="text.primary">{coin?.id}</Typography>
                </Breadcrumbs>
                {loading && <LinearProgress />}
                {coin && <>
                    <Chip label={`Rank #${coin?.market_cap_rank}`} /><br />
                    <Typography style={{ fontSize: "25px" }} varient="h6"><img src={coin?.image?.thumb} alt={coin?.name} /> {coin?.name}{"  "}({coin?.symbol.toUpperCase()})
                    </Typography>
                    <Typography style={{ fontSize: "30px", fontWeight: "bolder" }} varient="h6">{symbol}{numberWithCommas(coin?.market_data?.current_price[currency.toLowerCase()])}

                    </Typography>
                    <Typography style={{ color: coin?.market_data.price_change_percentage_24h > 0 ? "rgb(14, 203, 129)" : "#ed5565" }}>
                        {"  "}{coin?.market_data?.price_change_percentage_24h?.toFixed(2)} %
                    </Typography>

                </>}
                {
                    coin && (
                        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item lg={6} md={6} xs={12}>
                                <LinearProgress style={{ height: 10, borderRadius: 100 }} variant="determinate" value={value} />
                                <div className={classes.progressBar} >
                                    <Typography>{symbol}{
                                        numberWithCommas(coin.market_data.low_24h[currency.toLowerCase()])
                                    }
                                    </Typography>
                                    <Typography>24H Range</Typography>
                                    <Typography>
                                        {symbol}{
                                            numberWithCommas(coin.market_data.high_24h[currency.toLowerCase()])
                                        }
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item lg={6} md={6} xs={12}></Grid>
                            <Grid item lg={6} md={6} xs={12}>

                                <div className={classes.dataRow}>
                                    <Typography className={classes.title}>Market Capital</Typography>
                                    <Typography>{symbol}{
                                        numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()])
                                    }</Typography>
                                </div>
                                <div className={classes.dataRow}>
                                    <Typography className={classes.title}>Total Volume</Typography>
                                    <Typography>{symbol}{
                                        numberWithCommas(coin?.market_data.total_volume[currency.toLowerCase()])
                                    }</Typography>
                                </div>
                                <div className={classes.dataRow}>
                                    <Typography className={classes.title}>Fully Diluted Valuation</Typography>
                                    <Typography>{symbol}{
                                        numberWithCommas(coin?.market_data.fully_diluted_valuation[currency.toLowerCase()])
                                    }</Typography>
                                </div>
                            </Grid>

                            <Grid item lg={6} md={6} xs={12}>
                                <div className={classes.dataRow}>
                                    <Typography className={classes.title}>Circulating Supply</Typography>
                                    <Typography>{
                                        numberWithCommas(coin?.market_data.circulating_supply)
                                    }</Typography>
                                </div>
                                <div className={classes.dataRow}>
                                    <Typography className={classes.title}>Total Supply</Typography>
                                    <Typography>{
                                        numberWithCommas(coin?.market_data.total_supply)
                                    }</Typography>
                                </div>
                                <div className={classes.dataRow}>
                                    <Typography className={classes.title}>Max Supply</Typography>
                                    <Typography>{
                                        numberWithCommas(coin?.market_data.max_supply)
                                    }</Typography>
                                </div>
                            </Grid>
                        </Grid>
                    )
                }
            </Container>
            <Container>
                <Grid container>
                    <Grid item lg={8} md={12} xs={12} >
                        {coin && <Chart id={coin.id} current={coin.market_data.current_price[currency.toLowerCase()]} />}
                    </Grid>
                    <Grid item lg={4} md={12} xs={12}>
                        {
                            coin && !loading && (
                                <Sidebar numberWithCommas={numberWithCommas} symbol={symbol}
                                    currency={currency}
                                    coin={coin}
                                />
                            )
                        }
                    </Grid>
                </Grid>
                {
                    coin && (<>
                        <Typography style={{ color: "white", fontSize: "30px" }}>What is {coin?.name}?</Typography>
                        <Typography style={{ color: "white" }} dangerouslySetInnerHTML={{ __html: coin?.description.en }}></Typography>
                    </>)
                }
            </Container>
        </ThemeProvider>
    )
}

export default Coin
