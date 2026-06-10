
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Paper,
    Typography,
    Avatar,
    Stack,
    Box,
    Button,
    Divider,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
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
                maxWidth: 500,
                mx: 'auto',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    border: '1px solid #eee',
                    borderRadius: 4,
                    p: 4,
                }}
            >
                <Stack
                    spacing={3}
                    sx={{
                        alignItems: "center"
                    }}
                >
                    <Avatar
                        sx={{
                            width: 72,
                            height: 72,
                            bgcolor: 'black',
                        }}
                    >
                        <PersonIcon />
                    </Avatar>

                    <Box
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                            }}
                        >
                            {user?.name}
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            {user?.email}
                        </Typography>
                    </Box>

                    <Divider flexItem />

                    <Stack
                        spacing={2}
                        width="100%"
                    >
                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Role
                            </Typography>

                            <Typography>
                                {user?.role}
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={
                                <LogoutIcon />
                            }
                            onClick={handleLogout}
                            sx={{
                                mt: 1,
                                borderRadius: 3,
                            }}
                        >
                            Logout
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Profile;