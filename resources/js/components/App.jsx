import React from "react";
import Router from "../router/Router";
import Header from "./inventory/Header";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const App = () => {
    return(
        <div>
            <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Header />
            <Router />
            </ThemeProvider>
        </div>
    )
}

export default App;