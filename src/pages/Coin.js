import React, { useState, useEffect } from "react";
import {
  Container,
  Chip,
  ThemeProvider,
  createTheme,
  LinearProgress,
  Typography,
  Grid,
  Breadcrumbs,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { Link, useParams } from "react-router-dom";
import { SingleCoin } from "../config/api";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import { CryptoState } from "../context";
import Chart from "../components/Chart";
import Sidebar from "../components/Sidebar";
import io from "socket.io-client";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
//import { doc, setDoc } from "firebae/firestore"
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import Chatbox from "../components/Chatbox";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    color: "white",
    backgroundColor: "#121212",
    fontSize: 50,
  },
  progressBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dataRow: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    borderBottom: "0.5px solid #787e87",
  },
  title: {
    color: "#787e87",
  },
}));

const Coin = () => {
  const { currency, symbol, user, watchlist, setAlert } = CryptoState();
  const classes = useStyles();
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState();
  const [change, setChange] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [soc, setSoc] = useState(null);
  const fetchData = async () => {
    setLoading(true);
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
    document.title = "Coinwatch " + data.name;
    setLoading(false);
  };
  var elem = document.documentElement;
  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
    setFullScreen(true);
  }
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
    setFullScreen(false);
  }
  function numberWithCommas(x) {
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return null;
    }
  }
  const likeCoin = async () => {
    const coinRef = doc(db, "likes", user.uid);
    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin.id] : [coin?.id],
      });
      setAlert({
        open: true,
        message: "Coin Removed",
        type: "success",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: err.message,
        type: "error",
      });
    }
  };
  const unLikeCoin = async () => {
    const coinRef = doc(db, "likes", user.uid);
    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch !== coin?.id),
        },
        { merge: true }
      );
      setAlert({
        open: true,
        message: "Coin unliked",
        type: "warning",
      });
    } catch (err) {
      setAlert({
        open: true,
        message: err.message,
        type: "error",
      });
    }
  };
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  useEffect(() => {
    fetchData();
    const socket = io(`https://abiding-nettle-sandpaper.glitch.me`,
      {
        autoConnect: true,
      }
    );
    setSoc(socket);
    socket.emit("joinroom", id);
    socket.on("time", (msg) => {
      console.log("time",msg)
      setTime(msg);
    });
    socket.on("data", (data) => {
      const currentVal = data.market_data.current_price[currency.toLowerCase()];
      setCoin((preVal) => {
        setChange(
          currentVal - preVal.market_data.current_price[currency.toLowerCase()]
        );
        return data;
      });
    });
    //eslint-disable-next-line
  }, []);

  const current = coin?.market_data.current_price[currency.toLowerCase()];
  const min = coin?.market_data.low_24h[currency.toLowerCase()];
  const max = coin?.market_data.high_24h[currency.toLowerCase()];
  const value = ((current - min) * 100) / (max - min);
  const inWatchlist = watchlist.includes(coin?.id);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container className="container">
        {loading && <LinearProgress />}

        <Breadcrumbs aria-label="breadcrumb">
          <Link
            style={{ color: "#1db954" }}
            underline="hover"
            color="inherit"
            to="/"
          >
            Coins
          </Link>
          <Typography color="text.primary">{coin?.id}</Typography>
        </Breadcrumbs>

        {coin && (
          <Grid container>
            <Grid item lg={12} sm={12} md={6} xs={12}>
              <Chip label={`Rank #${coin?.market_cap_rank}`} />
              <br />
              <Typography
                style={{
                  fontSize: "25px",
                  padding: "5px",
                  color:
                    change === 0
                      ? "white"
                      : change > 0
                      ? "rgb(14, 203, 129)"
                      : "#ed5565",
                }}
                varient="h1"
              >
                <img
                  style={{ width: "30px", padding: "12px 5px 0 0" }}
                  src={coin?.image?.small}
                  alt={coin?.name}
                />
                {coin?.name}
                {"  "}({coin?.symbol.toUpperCase()})
              </Typography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  style={{
                    fontSize: "35px",
                    fontWeight: "bolder",
                    color:
                      change === 0
                        ? "white"
                        : change > 0
                        ? "rgb(14, 203, 129)"
                        : "#ed5565",
                  }}
                  varient="h6"
                >
                  {symbol}
                  {numberWithCommas(
                    coin?.market_data?.current_price[currency.toLowerCase()]
                  )}
                  {change === 0 ? (
                    <></>
                  ) : change > 0 ? (
                    <TrendingUpIcon
                      sx={{ color: "rgb(14, 203, 129)" }}
                      fontSize="large"
                    />
                  ) : (
                    <TrendingDownIcon
                      sx={{ color: "#ed5565" }}
                      fontSize="large"
                    />
                  )}
                </Typography>
                <div>
                  {user && inWatchlist && (
                    <FavoriteIcon
                      fontSize="large"
                      sx={{
                        color: "red",
                        marginRight: "20px",
                        cursor: "pointer",
                      }}
                      onClick={unLikeCoin}
                    />
                  )}
                  {user && !inWatchlist && (
                    <FavoriteBorderIcon
                      fontSize="large"
                      sx={{
                        color: "red",
                        marginRight: "20px",
                        cursor: "pointer",
                      }}
                      onClick={likeCoin}
                    />
                  )}
                  {fullScreen ? (
                    <FullscreenExitIcon
                      style={{ cursor: "pointer" }}
                      onClick={closeFullscreen}
                      fontSize="large"
                    />
                  ) : (
                    <FullscreenIcon
                      style={{ cursor: "pointer" }}
                      onClick={openFullscreen}
                      fontSize="large"
                    />
                  )}
                </div>
              </div>
              <Typography
                style={{
                  color:
                    coin?.market_data.price_change_percentage_24h > 0
                      ? "rgb(14, 203, 129)"
                      : "#ed5565",
                }}
              >
                {"  "}
                {coin?.market_data?.price_change_percentage_24h?.toFixed(2)} %
              </Typography>
              <Typography>{time}</Typography>
            </Grid>
            <Grid item lg={6} sm={12} md={12}></Grid>
          </Grid>
        )}
        {coin && (
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item lg={6} md={6} xs={12}>
              <LinearProgress
                style={{ height: 10, borderRadius: 100 }}
                variant="determinate"
                value={value}
              />
              <div className={classes.progressBar}>
                <Typography>
                  {symbol}
                  {numberWithCommas(
                    coin.market_data.low_24h[currency.toLowerCase()]
                  )}
                </Typography>
                <Typography>24H Range</Typography>
                <Typography>
                  {symbol}
                  {numberWithCommas(
                    coin.market_data.high_24h[currency.toLowerCase()]
                  )}
                </Typography>
              </div>
            </Grid>
            <Grid item lg={6} md={6} xs={12}></Grid>
            <Grid item lg={6} md={6} xs={12}>
              <div className={classes.dataRow}>
                <Typography className={classes.title}>
                  Market Capital
                </Typography>
                <Typography>
                  {symbol}
                  {numberWithCommas(
                    coin?.market_data.market_cap[currency.toLowerCase()]
                  )}
                </Typography>
              </div>
              <div className={classes.dataRow}>
                <Typography className={classes.title}>Total Volume</Typography>
                <Typography>
                  {symbol}
                  {numberWithCommas(
                    coin?.market_data.total_volume[currency.toLowerCase()]
                  )}
                </Typography>
              </div>
              <div className={classes.dataRow}>
                <Typography className={classes.title}>
                  Fully Diluted Valuation
                </Typography>
                <Typography>
                  {symbol}
                  {numberWithCommas(
                    coin?.market_data.fully_diluted_valuation[
                      currency.toLowerCase()
                    ]
                  )}
                </Typography>
              </div>
            </Grid>

            <Grid item lg={6} md={6} xs={12}>
              <div className={classes.dataRow}>
                <Typography className={classes.title}>
                  Circulating Supply
                </Typography>
                <Typography>
                  {numberWithCommas(coin?.market_data.circulating_supply)}
                </Typography>
              </div>
              <div className={classes.dataRow}>
                <Typography className={classes.title}>Total Supply</Typography>
                <Typography>
                  {numberWithCommas(coin?.market_data.total_supply)}
                </Typography>
              </div>
              <div className={classes.dataRow}>
                <Typography className={classes.title}>Max Supply</Typography>
                <Typography>
                  {numberWithCommas(coin?.market_data.max_supply)}
                </Typography>
              </div>
            </Grid>
          </Grid>
        )}
      </Container>
      <Container>
        <Grid container>
          <Grid item lg={8} md={12} xs={12}>
            {coin && (
              <Chart
                id={coin.id}
                current={coin.market_data.current_price[currency.toLowerCase()]}
              />
            )}
          </Grid>
          <Grid item lg={4} md={12} xs={12}>
            <Grid container>
              <Grid item lg={12} md={12} xs={12}>
                {user && soc && soc.connected && (
                  <Chatbox socket={soc} img={coin?.image?.thumb} />
                )}
              </Grid>
              <Grid item lg={12} md={12} xs={12}>
                {coin && !loading && (
                  <Sidebar
                    numberWithCommas={numberWithCommas}
                    symbol={symbol}
                    currency={currency}
                    coin={coin}
                    change={change}
                  />
                )}
              </Grid>
              
            </Grid>
          </Grid>
        </Grid>

        {coin && (
          <>
            <Typography style={{ color: "white", fontSize: "30px" }}>
              What is {coin?.name}?
            </Typography>
            <Typography
              style={{ marginBottom: "50px" }}
              className={classes.title}
              dangerouslySetInnerHTML={{ __html: coin?.description.en }}
            ></Typography>
          </>
        )}
      </Container>
      <Container></Container>
    </ThemeProvider>
  );
};

export default Coin;
