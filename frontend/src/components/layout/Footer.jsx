import {
    Box,
    Container,
    Typography,
    Stack,
} from '@mui/material';

import {
    Link,
} from 'react-router-dom';

const footerLinkStyle = {
    color: '#666',
    textDecoration: 'none',
    transition: '.2s',

    '&:hover': {
        color: '#111',
    },
};

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 12,
                borderTop: '1px solid #eee',
                bgcolor: '#fff',
            }}
        >
            <Container maxWidth="lg">

                <Box
                    sx={{
                        py: 8,
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: '2fr 1fr 1fr 1fr',
                        },
                        gap: 6,
                    }}
                >

                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                            }}
                        >
                            pomu/
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{
                                maxWidth: 320,
                                lineHeight: 1.8,
                            }}
                        >
                            Premium skincare,
                            cosmetics and beauty
                            products carefully
                            selected for everyday
                            self-care.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                            }}
                        >
                            Shop
                        </Typography>

                        <Stack spacing={1.5}>
                            <Typography
                                component={Link}
                                to="/catalog"
                                sx={footerLinkStyle}
                            >
                                Catalog
                            </Typography>

                            <Typography
                                component={Link}
                                to="/cart"
                                sx={footerLinkStyle}
                            >
                                Cart
                            </Typography>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                            }}
                        >
                            Account
                        </Typography>

                        <Stack spacing={1.5}>
                            <Typography
                                component={Link}
                                to="/profile"
                                sx={footerLinkStyle}
                            >
                                Profile
                            </Typography>

                            <Typography
                                component={Link}
                                to="/orders"
                                sx={footerLinkStyle}
                            >
                                Orders
                            </Typography>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                            }}
                        >
                            Support
                        </Typography>

                        <Stack spacing={1.5}>
                            <Typography
                                sx={{
                                    color:
                                        'text.secondary',
                                }}
                            >
                                support@pomu.com
                            </Typography>

                            <Typography
                                sx={{
                                    color:
                                        'text.secondary',
                                }}
                            >
                                Mon–Fri
                            </Typography>

                            <Typography
                                sx={{
                                    color:
                                        'text.secondary',
                                }}
                            >
                                09:00 – 18:00
                            </Typography>
                        </Stack>
                    </Box>

                </Box>

                <Box
                    sx={{
                        py: 3,
                        borderTop:
                            '1px solid #eee',
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        © 2026 pomu. All rights
                        reserved.
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Built with React & PHP
                    </Typography>
                </Box>

            </Container>
        </Box>
    );
};

export default Footer;