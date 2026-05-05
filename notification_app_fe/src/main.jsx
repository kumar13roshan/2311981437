import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import './styles/global.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1d4ed8',
    },
    success: {
      main: '#059669',
    },
    warning: {
      main: '#d97706',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

