import "./header.css"
import React from 'react';
import { AppBar, Container, MenuItem, Toolbar, Typography, ThemeProvider, createTheme } from "@mui/material";
import Select from '@mui/material/Select';
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../context";
import icon from "../coinwatch_icon.png"

const useStyles = makeStyles(() => ({
    title: {
        flex: 1,
        color: "white",
        fontWeight: "bolder",
        cursor: "pointer",
        fontSize: "200%",
    }
}))

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


const Header = () => {
    const history = useHistory()
    const styles = useStyles();
    const { currency, setCurrency } = CryptoState()
    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar fixed style={{ color: "white", padding: 0 }} color="transparent" position="static">
                <Container style={{ padding: 0 }}>
                    <Toolbar>
                        <img style={{ width: "20px", marginRight: "5px" }} src={icon} alt="coinwatch" />
                        <Typography varient="h1" onClick={() => history.push("/")} className={styles.title}>
                            {" "}COINWATCH</Typography>
                        <Select
                            value={currency} onChange={(e) => setCurrency(e.target.value)} variant="standard" >
                            <MenuItem value={"USD"}>USD</MenuItem>
                            <MenuItem value={"INR"}>INR</MenuItem>
                        </Select>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}

export default Header
