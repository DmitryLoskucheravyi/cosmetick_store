import { useState } from 'react';
import { toast } from 'react-toastify';
import { Box, TextField, Button, Stack } from '@mui/material';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// TODO: wire up to a real newsletter endpoint once the backend has one.
// For now it just confirms locally, same stub pattern as the Contact form.
const NewsletterForm = () => {
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);

    const isValid = EMAIL_REGEX.test(email);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid || sending) return;

        setSending(true);

        setTimeout(() => {
            console.log('Newsletter signup:', email);
            setSending(false);
            setEmail('');
            toast.success('Thanks for subscribing!');
        }, 500);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420, mx: 'auto' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    sx={{ bgcolor: 'background.paper', borderRadius: '10px' }}
                />

                <Button type="submit" variant="contained" size="large" disabled={!isValid || sending}>
                    {sending ? 'Sending…' : 'Subscribe'}
                </Button>
            </Stack>
        </Box>
    );
};

export default NewsletterForm;
