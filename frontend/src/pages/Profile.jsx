import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { Paper, Typography, Avatar, Stack, Box, Button, Chip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

import { logout } from '../redux/auth/authSlice';
import { colors } from '../theme/theme';
import Reveal from '../motion/Reveal';

const QUICK_LINKS = [
    {
        to: '/orders',
        icon: <ReceiptLongOutlinedIcon />,
        title: 'My orders',
        description: 'Track and review past purchases',
    },
    {
        to: '/wishlist',
        icon: <FavoriteBorderIcon />,
        title: 'Wishlist',
        description: 'Products you saved for later',
    },
    {
        to: '/catalog',
        icon: <StorefrontOutlinedIcon />,
        title: 'Browse the catalog',
        description: 'Find something new to add to your routine',
    },
];

const formatMemberSince = (value) => {
    if (!value) return null;
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const memberSince = formatMemberSince(user?.createdAt);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                Profile
            </Typography>

            <Reveal>
                <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '16px', mb: 3 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Avatar
                            sx={{
                                width: 72,
                                height: 72,
                                fontSize: 28,
                                fontWeight: 700,
                                bgcolor: colors.punch,
                                flexShrink: 0,
                            }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>

                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="h5" fontWeight={700} sx={{ wordBreak: 'break-word' }}>
                                {user?.name}
                            </Typography>
                            <Typography color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                                {user?.email}
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                <Chip
                                    label={user?.role}
                                    size="small"
                                    sx={{ textTransform: 'capitalize', bgcolor: colors.zapSoft, fontWeight: 600 }}
                                />
                                {memberSince && (
                                    <Chip
                                        label={`Member since ${memberSince}`}
                                        size="small"
                                        sx={{ bgcolor: colors.grapeSoft, fontWeight: 600 }}
                                    />
                                )}
                            </Stack>
                        </Box>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{ flexShrink: 0, alignSelf: { xs: 'stretch', sm: 'center' } }}
                        >
                            Log out
                        </Button>
                    </Stack>
                </Paper>
            </Reveal>

            <Stack spacing={2}>
                {QUICK_LINKS.map((link) => (
                    <Paper
                        key={link.to}
                        component={Link}
                        to={link.to}
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: '.25s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 24px rgba(28,21,18,.08)',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                bgcolor: colors.punchSoft,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.punch,
                                flexShrink: 0,
                            }}
                        >
                            {link.icon}
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: 700 }}>{link.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {link.description}
                            </Typography>
                        </Box>

                        <ArrowOutwardIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
};

export default Profile;
