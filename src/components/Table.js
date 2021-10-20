import React from 'react';
import {
    TableContainer, Table, TableRow, TableHead, TableCell, TableBody, Paper, Container, TextField,
    LinearProgress,
    Pagination
} from "@mui/material";
import axios from "axios";
import { CoinList } from "../config/api"
import { CryptoState } from '../context';
import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';
import ChartGraph from './ChartGraph';

const useStyles = makeStyles(() => ({
    table: {
        color: "white",
        padding: 0
    }, searchBox: {
        marginBottom: 20,
        width: "100%",
    }, title: {
        marginTop: "25px",
        fontSize: "1.5rem",
        fontFamily: "Roboto Helvetica Arial sans-serif;"
    }
}))

const TableComp = () => {
    const history = useHistory();
    const classes = useStyles();
    const [coins, setCoins] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const { currency, symbol } = CryptoState();
    const [page, setPage] = React.useState(1);
    const fetchCoins = async () => {
        setLoading(true);
        const { data } = await axios.get(CoinList(currency, page));
        setCoins(data);
        setLoading(false);
    }
    const handleSearch = () => {
        return coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
    };
    function numberWithCommas(x) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            return null
        }
    }
    React.useEffect(() => {
        fetchCoins();
        // eslint-disable-next-line
    }, [currency, page])
    return (
        <Container className={classes.table}>
            <h1 className={classes.title}>Cryptocurrency Prices by Market Cap</h1>
            <TextField id="standard-basic" label="Search" variant="standard" margin="normal" style={{ border: "none" }} className={classes.searchBox}
                onChange={(e) => setSearch(e.target.value)}
            />
            <TableContainer component={Paper}>
                {
                    loading ? (<LinearProgress />) : (
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Rank</TableCell>
                                    <TableCell align="left">Coin</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">24h Change </TableCell>
                                    <TableCell align="right">24h Volume</TableCell>
                                    <TableCell align="right">Market Cap</TableCell>
                                    <TableCell align="center">Last 7 Days</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    coins && handleSearch().map(row => {
                                        const profit = row.price_change_percentage_24h > 0;
                                        return (
                                            <TableRow
                                                style={{ cursor: "pointer" }}
                                                key={row.name}
                                                onClick={() => history.push(`/coins/${row.id}`)}>
                                                <TableCell align="left">{row.market_cap_rank}</TableCell>
                                                <TableCell align="left">
                                                    <img style={{ maxWidth: "30px", marginBottom: -8 }} src={row.image} alt={row.name} />
                                                    {"   "}{row.name} ({row.symbol})</TableCell>
                                                <TableCell align="right">{symbol}{" "}{numberWithCommas(row.current_price?.toFixed(2))}</TableCell>
                                                <TableCell
                                                    style={{
                                                        color: row?.price_change_24h?.toFixed(2) > 0 ? "rgb(14, 203, 129)" : "red"
                                                    }}
                                                    align="right">{symbol}{" "}{numberWithCommas(row?.price_change_24h?.toFixed(2))}</TableCell>
                                                <TableCell style={{
                                                    color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                                                    fontWeight: 500,
                                                }} align="right">{profit && "+"}
                                                    {row.price_change_percentage_24h.toFixed(2)}%</TableCell>
                                                <TableCell align="right"> {symbol}{" "}
                                                    {numberWithCommas(
                                                        row.market_cap.toString().slice(0, -6)
                                                    )}
                                                    M</TableCell>
                                                <TableCell className="table_chart" align="right"><ChartGraph change={row.price_change_percentage_7d_in_currency} sparkline={row.sparkline_in_7d.price} /></TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    )
                }
            </TableContainer>
            <Container style={{ marginTop: "20px", marginBottom: "40px", display: "flex", justifyContent: "center" }}>
                <Pagination size="large" page={page} onChange={(event, value) => setPage(value)} count={4} />
            </Container>
        </Container>
    )
}

export default TableComp
