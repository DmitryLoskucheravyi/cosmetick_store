import { createTheme } from '@mui/material/styles';

// Brand tokens — soft, pastel-pink-led cosmetics identity. `punch` carries
// the brand everywhere text needs to sit on it (buttons, links) and is kept
// dark enough for AA contrast; `blush` is the lighter, purely decorative
// pastel used for blobs, backgrounds and ambient glow.
export const colors = {
    ink: '#2B1620',
    paper: '#FFFFFF',
    canvas: '#FFF1F6',
    line: '#F8D9E6',
    muted: '#7E5A69',

    punch: '#D6447D',
    punchDark: '#B22E64',
    punchSoft: '#FFDCEB',
    blush: '#FFAFCE',

    zap: '#FFCB4D',
    zapSoft: '#FFF2CE',

    grape: '#8A4AD1',
    grapeSoft: '#EFE0FC',

    mint: '#0FA980',
    mintSoft: '#DCF6EE',
};

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: colors.punch,
            dark: colors.punchDark,
            light: colors.punchSoft,
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: colors.grape,
            light: colors.grapeSoft,
            contrastText: '#FFFFFF',
        },
        warning: {
            main: colors.zap,
        },
        success: {
            main: colors.mint,
        },
        background: {
            default: colors.canvas,
            paper: colors.paper,
        },
        text: {
            primary: colors.ink,
            secondary: colors.muted,
        },
        divider: colors.line,
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: {
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(2.25rem, 1.6rem + 2.2vw, 3.5rem)',
            lineHeight: 1.1,
        },
        h2: {
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)',
            lineHeight: 1.15,
        },
        h3: {
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            fontSize: '1.75rem',
        },
        h4: {
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            fontSize: '1.5rem',
        },
        h5: {
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 700,
            fontSize: '1.25rem',
        },
        h6: {
            fontFamily: '"Bricolage Grotesque", sans-serif',
            fontWeight: 700,
            fontSize: '1.0625rem',
        },
        body1: {
            fontSize: '0.9375rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
        },
        caption: {
            fontSize: '0.75rem',
        },
        button: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.875rem',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: colors.canvas,
                },
                '::selection': {
                    backgroundColor: colors.punchSoft,
                    color: colors.punchDark,
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                },
                outlined: {
                    borderWidth: 1.5,
                    '&:hover': { borderWidth: 1.5 },
                },
                containedPrimary: {
                    backgroundColor: colors.punchDark,
                    '&:hover': { backgroundColor: '#9A2455' },
                },
                sizeSmall: {
                    height: 32,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 12,
                    paddingRight: 12,
                    fontSize: 13,
                },
                sizeMedium: {
                    height: 40,
                    paddingTop: 9,
                    paddingBottom: 9,
                    paddingLeft: 18,
                    paddingRight: 18,
                    fontSize: 14,
                },
                sizeLarge: {
                    height: 48,
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 24,
                    paddingRight: 24,
                    fontSize: 15,
                },
            },
        },
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
                rounded: {
                    borderRadius: 16,
                },
                outlined: {
                    borderColor: colors.line,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    fontWeight: 600,
                    height: 32,
                    fontSize: 13,
                },
                sizeSmall: {
                    height: 24,
                    fontSize: 12,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.paper,
                    color: colors.ink,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 16,
                    '&:last-child': {
                        paddingBottom: 16,
                    },
                },
            },
        },
    },
});
