import { createTheme, ThemeProvider } from '@mui/material'
import React, { } from 'react'
import TableComp from '../components/Table';


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

document.title = "Coinwatch"
const Home = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <TableComp />
        </ThemeProvider>
    )
}

export default Home
