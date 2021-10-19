import { Typography } from '@mui/material'
import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
const date = new Date();
const year = date.getFullYear()
const Footer = () => {
    return (
        <div className="footer_container">
            <Typography style={{ color: "#adb5bd" }}> Copyright &copy; {year} Coinwatch</Typography>
            <div className="footer_icons">
                <a href="https://github.com/kaushikappani/coinwatch" rel="noreferrer dofollow" target="_blank"><GitHubIcon fontSize="large" /></a>
                <a href="https://www.linkedin.com/in/kaushikappani/" rel="noreferrer dofollow" target="_blank"><LinkedInIcon fontSize="large" /></a>
                <a href="https://kaushikappani.me" rel="noreferrer dofollow" target="_blank"><LanguageIcon fontSize="large" /></a>
            </div>
        </div>
    )
}

export default Footer
