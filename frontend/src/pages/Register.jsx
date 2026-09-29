import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { TextField, Typography, Button, Stack } from '@mui/material';

import { registerUser } from '../redux/auth/authSlice';
import AuthLayout from '../components/layout/AuthLayout';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const { user, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData));
    };

    return (
        <AuthLayout
            flip
            title="Create an account"
            description="Sign up to check out faster and track your orders."
            footer={
                <Typography variant="body2">
                    Already have an account?{' '}
                    <Typography component={Link} to="/login" sx={{ display: 'inline', fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}>
                        Log in
                    </Typography>
                </Typography>
            }
        >
            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
                <TextField
                    label="Full name"
                    name="name"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange}
                />

                <TextField
                    label="Email"
                    name="email"
                    type="email"
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

                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}

                <Button type="submit" variant="contained" size="large" disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account'}
                </Button>
            </Stack>
        </AuthLayout>
    );
};

export default Register;
