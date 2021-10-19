import { Typography, Grid } from '@mui/material'
import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
const date = new Date();
const year = date.getFullYear()
const Footer = () => {
    return (
        <Grid className="footer_container" container columnSpacing={{ xs: 3, sm: 3, md: 3 }}>
            <Grid item lg={6} md={6} xs={12}>
                <Typography style={{ color: "#adb5bd" }}> Copyright &copy; {year} Coinwatch</Typography>
            </Grid>
            <Grid className="footer_icons" item lg={6} md={6} xs={12}>
                <a href="https://github.com/kaushikappani/coinwatch" rel="noreferrer dofollow" target="_blank"><GitHubIcon fontSize="large" /></a>
                <a href="https://www.linkedin.com/in/kaushikappani/" rel="noreferrer dofollow" target="_blank"><LinkedInIcon fontSize="large" /></a>
                <a href="https://kaushikappani.me" rel="noreferrer dofollow" target="_blank"><LanguageIcon fontSize="large" /></a>
            </Grid>
        </Grid>
    )
}

export default Footer
