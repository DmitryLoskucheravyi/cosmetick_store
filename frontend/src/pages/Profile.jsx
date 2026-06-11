import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Paper,
    Typography,
    Avatar,
    Stack,
    Box,
    Button,
    Chip,
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

import { logout } from '../redux/auth/authSlice';

const Profile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(
        state => state.auth
    );

    const handleLogout = () => {

        dispatch(logout());

        navigate('/login');
    };

    return (
        <Box
            sx={{
                maxWidth: 800,
                mx: 'auto',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                }}
            >
                Profile
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    border: '1px solid #eee',
                    borderRadius: 4,
                }}
            >
                <Stack spacing={4}>

                    <Stack
                        direction="row"
                        spacing={3}
                        sx={{
                            alignItems:"center"
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 72,
                                height: 72,
                                fontSize: 28,
                                fontWeight: 700,
                            }}
                        >
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </Avatar>

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                {user?.name}
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                {user?.email}
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        label={user?.role}
                        sx={{
                            width: 'fit-content',
                            textTransform:
                                'capitalize',
                        }}
                    />

                    <Box
                        sx={{
                            display: 'grid',
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Full Name
                            </Typography>

                            <Typography>
                                {user?.name}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Email Address
                            </Typography>

                            <Typography>
                                {user?.email}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={
                            <LogoutIcon />
                        }
                        onClick={handleLogout}
                        sx={{
                            width: 'fit-content',
                            borderRadius: 3,
                            textTransform:
                                'none',
                        }}
                    >
                        Logout
                    </Button>

                </Stack>
            </Paper>
        </Box>
    );
};

export default Profile;