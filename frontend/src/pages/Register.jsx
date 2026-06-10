import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { registerUser } from '../redux/auth/authSlice';

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
} from '@mui/material';

const Register = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { user } = useSelector(
        state => state.auth
    );
    useEffect(() => {

        if (user) {

            navigate('/');
        }

    }, [user, navigate]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError('');

            dispatch(
                registerUser(formData)
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                'Registration failed'
            );

        } finally {

            setLoading(false);
        }
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
                    Join pomu/
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    Create Account
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 4,
                    }}
                >
                    Create your account and start shopping.
                </Typography>

                <Stack
                    spacing={2.5}
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        label="Full Name"
                        name="name"
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        value={formData.password}
                        onChange={handleChange}
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
                            py: 1.5,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {
                            loading
                                ? 'Creating account...'
                                : 'Create Account'
                        }
                    </Button>

                    <Typography
                        variant="body2"
                        sx={
                            { textAlign: "center" }
                        }
                    >
                        Already have an account?{' '}
                        <Typography
                            component={Link}
                            to="/login"
                            sx={{
                                display: 'inline',
                                textDecoration: 'none',
                                fontWeight: 600,
                                color: 'primary.main',
                            }}
                        >
                            Sign In
                        </Typography>
                    </Typography>

                </Stack>
            </Paper>
        </Box>
    );
};

export default Register;