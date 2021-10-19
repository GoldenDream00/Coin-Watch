import React from 'react';
import { makeStyles } from "@mui/styles";
import { Container, Typography } from "@mui/material"

const useStyles = makeStyles(() => ({
    banner: {
        backgroundImage: "url(https://raw.githubusercontent.com/piyush-eon/react-crypto-tracker/master/public/banner2.jpg)"
    }, content: {
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        paddingTop: 25,
        justifyContent: "space-around"
    }, tagline: {
        color: "white",
        displat: "flex",
        justifyContent: "center",
        textAlign: "center"
    }
}))

const Banner = () => {
    const classes = useStyles();
    return (
        <Container>
            <div className={classes.banner}>
                <Container className={classes.container}>
                    <div className={classes.tagline}>
                        <Typography varient="h2" style={
                            { fontWeight: "bold", marginBottom: 15, fontSize: 50 }}>Crypto</Typography>
                    </div>
                </Container>
            </div>
        </Container>
    )
}

export default Banner

