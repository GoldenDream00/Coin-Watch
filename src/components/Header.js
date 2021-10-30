import "./header.css"
import React from 'react';
import { AppBar, Container, MenuItem, Toolbar, Typography, ThemeProvider, createTheme, IconButton, Avatar, Menu } from "@mui/material";
import Select from '@mui/material/Select';
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { CryptoState } from "../context";
import icon from "../coinwatch_icon.png";
import GoogleIcon from '@mui/icons-material/Google';
import { auth } from "../firebase"
import { GoogleAuthProvider, signInWithPopup, signOut } from "@firebase/auth";

const useStyles = makeStyles(() => ({
    title: {
        flex: 1,
        color: "white",
        fontWeight: "bolder",
        cursor: "pointer",
        fontSize: "200%",
    }, userProfile: {
        width: 40,
        borderRadius: "100%",
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { currency, setCurrency, user, setAlert } = CryptoState()
    console.log(user);
    const provider = new GoogleAuthProvider();
    const googleSignin = () => {
        signInWithPopup(auth, provider).then(res => {
            setAlert({
                open: true,
                message: `Sign in successfully ${res.user.email}`,
                type: "success",
            })
        }).catch(err => {
            setAlert({
                open: true,
                message: err.message,
                type: "error",
            })
        })
    }


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                        {user ? <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar src={user.photoURL} />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => { signOut(auth) }}>Logout</MenuItem>
                            </Menu>
                        </div> :
                            <IconButton onClick={googleSignin} aria-label="delete" size="large">
                                <GoogleIcon />
                            </IconButton>}
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}

export default Header
