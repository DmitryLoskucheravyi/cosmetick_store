import {
    Box,
    Container,
    Typography,
    Stack,
} from '@mui/material';

import {
    Link,
} from 'react-router-dom';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 10,
                borderTop: '1px solid #f1f1f1',
                bgcolor: '#fafafa',
            }}
        >
            <Container maxWidth="xl">
                <Stack
                    direction={{
                        xs: 'column',
                        md: 'row',
                    }}
                    spacing={3}
                    sx={{
                        py: 5,
                        justifyContent: 'space-between',
                        alignItems: {
                            xs: 'center',
                            md: 'flex-start',
                        },
                    }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            pomu/
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Premium skincare & beauty products.
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={4}
                    >
                        <Typography
                            component={Link}
                            to="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            Home
                        </Typography>

                        <Typography
                            component={Link}
                            to="/catalog"
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            Catalog
                        </Typography>

                        <Typography
                            component={Link}
                            to="/cart"
                            sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            Cart
                        </Typography>
                    </Stack>
                </Stack>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        py: 2,
                        textAlign: 'center',
                        borderTop: '1px solid #eee',
                    }}
                >
                    © 2026 pomu/. All rights reserved.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;