import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { TextField, Typography, Button, Stack } from '@mui/material';

import { loginUser } from '../redux/auth/authSlice';
import AuthLayout from '../components/layout/AuthLayout';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <AuthLayout
            title="Log in"
            description="Access your account and pick up where you left off."
            footer={
                <Typography variant="body2">
                    Don't have an account?{' '}
                    <Typography component={Link} to="/register" sx={{ display: 'inline', fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}>
                        Create one
                    </Typography>
                </Typography>
            }
        >
            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}

                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 1 }}>
                    {loading ? 'Logging in…' : 'Log in'}
                </Button>
            </Stack>
        </AuthLayout>
    );
};

export default Login;
