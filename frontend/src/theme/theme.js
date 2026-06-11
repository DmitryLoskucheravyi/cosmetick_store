import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#410606',
        },
        secondary: {
            main: '#EC4899',
        },
        background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
        },
    },
    shape: {
        borderRadius: 6 ,
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
    },
});