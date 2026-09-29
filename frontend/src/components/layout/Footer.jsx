import { Box, Container, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { colors } from '../../theme/theme';

const footerLinkStyle = {
    color: colors.muted,
    textDecoration: 'none',
    transition: '.2s',
    width: 'fit-content',

    '&:hover': {
        color: colors.ink,
    },
};

const Footer = () => {
    return (
        <Box component="footer" sx={{ mt: 8, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        py: 6,
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' },
                        gap: 4,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, mb: 2, display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
                        >
                            pomu
                            <Box
                                component="span"
                                sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.punch, display: 'inline-block' }}
                            />
                        </Typography>

                        <Typography color="text.secondary" sx={{ maxWidth: 320, lineHeight: 1.8, mb: 2 }}>
                            Skincare and makeup picked for daily use, not just the shelf.
                        </Typography>

                        <Typography color="text.secondary" variant="body2">support@pomu.com</Typography>
                        <Typography color="text.secondary" variant="body2">Mon–Fri, 09:00–18:00</Typography>
                    </Box>

                    <Box>
                        <Typography sx={{ fontWeight: 700, mb: 2 }}>Shop</Typography>
                        <Stack spacing={1.5}>
                            <Typography component={Link} to="/catalog" sx={footerLinkStyle}>
                                Catalog
                            </Typography>
                            <Typography component={Link} to="/cart" sx={footerLinkStyle}>
                                Cart
                            </Typography>
                            <Typography component={Link} to="/wishlist" sx={footerLinkStyle}>
                                Wishlist
                            </Typography>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography sx={{ fontWeight: 700, mb: 2 }}>Account</Typography>
                        <Stack spacing={1.5}>
                            <Typography component={Link} to="/profile" sx={footerLinkStyle}>
                                Profile
                            </Typography>
                            <Typography component={Link} to="/orders" sx={footerLinkStyle}>
                                Orders
                            </Typography>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography sx={{ fontWeight: 700, mb: 2 }}>Company</Typography>
                        <Stack spacing={1.5}>
                            <Typography component={Link} to="/about" sx={footerLinkStyle}>
                                About us
                            </Typography>
                            <Typography component={Link} to="/contact" sx={footerLinkStyle}>
                                Contact
                            </Typography>
                            <Typography component={Link} to="/privacy-policy" sx={footerLinkStyle}>
                                Privacy Policy
                            </Typography>
                            <Typography component={Link} to="/terms" sx={footerLinkStyle}>
                                Terms of Use
                            </Typography>
                        </Stack>
                    </Box>
                </Box>

                <Box
                    sx={{
                        py: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © 2026 pomu. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
