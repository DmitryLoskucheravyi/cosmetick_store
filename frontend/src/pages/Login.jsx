import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Box,
    Paper,
    TextField,
    Typography,
    Button,
    Stack,
} from '@mui/material';

import { loginUser } from '../redux/auth/authSlice';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        error,
        user,
    } = useSelector(
        state => state.auth
    );

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {

        if (user) {

            navigate('/');
        }

    }, [user, navigate]);

    const handleSubmit = (e) => {

        e.preventDefault();

        dispatch(
            loginUser({
                email,
                password,
            })
        );
    };

    return (
        <Box
            sx={{
                minHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 460,
                    p: 5,
                    borderRadius: 5,
                    border: '1px solid #eee',
                    bgcolor: 'white',
                }}
            >
                <Typography
                    sx={{
                        fontSize: 14,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                        mb: 1,
                    }}
                >
                    Welcome back
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    Sign In
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 4,
                    }}
                >
                    Access your account and continue shopping.
                </Typography>

                <Stack
                    component="form"
                    spacing={2.5}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        label="Email"
                        fullWidth
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    {
                        error && (
                            <Typography
                                color="error"
                                variant="body2"
                            >
                                {error}
                            </Typography>
                        )
                    }

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                            mt: 1,
                            py: 1.5,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {
                            loading
                                ? 'Signing in...'
                                : 'Sign In'
                        }
                    </Button>
                    <Typography
                        variant="body2"
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        Don't have an account?{' '}
                        <Typography
                            component={Link}
                            to="/register"
                            sx={{
                                display: 'inline',
                                textDecoration: 'none',
                                fontWeight: 600,
                                color: 'primary.main',
                            }}
                        >
                            Create account
                        </Typography>
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Login;