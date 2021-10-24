import { Typography } from '@mui/material'
import React from 'react';
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
    dataRow: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 20,
        borderBottom: "1px solid #787e87",
    }, container: {
        color: "white",
        backgroundColor: "#1e1e1e",
        padding: "10px",
        borderRadius: "10px"
    }, title: {
        color: "#787e87"
    }, red: {
        color: "red"
    }, green: {
        color: "rgb(14, 203, 129)"
    }, link: {
        color: "#90caf9",
        textDecoration: "none"
    }
}))

const Sidebar = ({ numberWithCommas, coin, currency, symbol, change }) => {
    const classes = useStyles();
    const marketData = [{
        title: `${coin?.symbol.toUpperCase()} Price`,
        value: symbol + numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()]),
        class: change === 0 ? "" : (change > 0 ? "green" : "red"),
    }, {
        title: "Market Capital",
        value: symbol + numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()])
    }, {
        title: "All Time high",
        value: symbol + numberWithCommas(coin?.market_data.ath[currency.toLowerCase()])
    }, {
        title: "All-Time Low",
        value: symbol + numberWithCommas(coin?.market_data.atl[currency.toLowerCase()])
    }, {
        title: "All-Time High change Percentage",
        value: coin?.market_data.ath_change_percentage[currency.toLowerCase()] + " %",
        class: "red",
    }, {
        title: "All-Time Low change Percentage",
        value: coin?.market_data.atl_change_percentage[currency.toLowerCase()] + " %",
        class: "green"
    }, {
        title: "Market Cap Rank",
        value: coin?.market_cap_rank,
    }, {
        title: "Coingecoko Rank",
        value: coin?.coingecko_rank
    }, {
        title: "Home page",
        value: coin?.links?.homepage[0],
        class: "link"
    }, {
        title: "Price Change in 24H",
        value: coin?.market_data?.price_change_percentage_24h + " %",
        class: coin?.market_data?.price_change_percentage_24h > 0 ? "green" : "red",
    }, {
        title: "Price Change in 7 Days",
        value: coin?.market_data?.price_change_percentage_7d + " %",
        class: coin?.market_data?.price_change_percentage_7d > 0 ? "green" : "red",
    }, {
        title: "Price Change in 14 Days",
        value: coin?.market_data?.price_change_percentage_14d + " %",
        class: coin?.market_data?.price_change_percentage_14d > 0 ? "green" : "red",
    }, {
        title: "Price Change in 30 Days",
        value: coin?.market_data?.price_change_percentage_30d + " %",
        class: coin?.market_data?.price_change_percentage_30d > 0 ? "green" : "red",
    }, {
        title: "Price Change in 1 Year",
        value: coin?.market_data?.price_change_percentage_1y + " %",
        class: coin?.market_data?.price_change_percentage_1y > 0 ? "green" : "red",
    }
    ]
    const communityData = [
        {
            title: "Facebook Likes",
            value: coin?.community_data?.facebook_likes
        }, {
            title: "Twitter Followers",
            value: coin?.community_data?.twitter_followers
        }
    ]
    return (
        <div className={classes.container}>
            <Typography >BTC Price and Market Stats</Typography>
            {
                marketData.map(e => {
                    return (
                        <div className={classes.dataRow}>
                            <Typography className={classes.title}>{e.title}</Typography>
                            {e.class === "link" ? <a rel="nooperer noreferrer" target="_blank" className={classes[e.class]} href={e.value}>{e.value}</a> :
                                <Typography className={classes[e.class]}>{
                                    e.value
                                }</Typography>}

                        </div>
                    )
                })
            }
            <Typography>Community Data</Typography>
            {communityData.map(e => {
                return (
                    <div className={classes.dataRow}>
                        <Typography className={classes.title}>{e.title}</Typography>
                        <Typography className={classes[e.class]}>{
                            e.value
                        }</Typography>

                    </div>
                )
            })}
        </div>
    )
}

export default Sidebar
