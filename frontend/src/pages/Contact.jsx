import { useState } from 'react';
import { toast } from 'react-toastify';

import { Box, Typography, TextField, Button, Stack, Paper } from '@mui/material';
import Reveal from '../motion/Reveal';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM = { name: '', email: '', message: '' };

// TODO: wire up to a real POST /contact endpoint once the backend has one.
// For now this just confirms receipt locally, same pattern as the
// newsletter form on Home.
const Contact = () => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [sending, setSending] = useState(false);

    const isValid = form.name.trim() && EMAIL_REGEX.test(form.email) && form.message.trim();

    const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid) return;

        setSending(true);

        setTimeout(() => {
            setSending(false);
            setForm(INITIAL_FORM);
            toast.success("Thanks — we'll get back to you soon!");
        }, 500);
    };

    return (
        <Box sx={{ maxWidth: 560, mx: 'auto' }}>
            <Reveal>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Contact us
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Questions about an order or a product? Send us a message and we'll reply
                    within a business day.
                </Typography>
            </Reveal>

            <Reveal delay={0.08}>
                <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '16px' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Name"
                                fullWidth
                                value={form.name}
                                onChange={handleChange('name')}
                                required
                            />

                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                value={form.email}
                                onChange={handleChange('email')}
                                error={form.email.length > 0 && !EMAIL_REGEX.test(form.email)}
                                helperText={form.email.length > 0 && !EMAIL_REGEX.test(form.email) ? 'Enter a valid email' : ' '}
                                required
                            />

                            <TextField
                                label="Message"
                                fullWidth
                                multiline
                                minRows={4}
                                value={form.message}
                                onChange={handleChange('message')}
                                required
                            />

                            <Button type="submit" variant="contained" size="large" disabled={!isValid || sending}>
                                {sending ? 'Sending…' : 'Send message'}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Reveal>
        </Box>
    );
};

export default Contact;
