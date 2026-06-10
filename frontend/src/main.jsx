import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { ToastContainer } from 'react-toastify';

import App from './App';
import { store } from './app/store';
import { theme } from './theme/theme';

import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <App />
                    <ToastContainer />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);