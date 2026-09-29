import { Box, Typography, Stack } from '@mui/material';
import Reveal from '../motion/Reveal';

// Placeholder legal copy — replace with the client's reviewed policy before launch.
const SECTIONS = [
    {
        title: '1. What we collect',
        text: 'When you create an account or place an order, we collect your name, email, phone number and delivery address. We never collect payment card details directly — those are handled by our payment provider.',
    },
    {
        title: '2. How we use it',
        text: 'Your information is used to process orders, provide customer support, and — only if you opt in — send you updates about new products and promotions.',
    },
    {
        title: '3. Sharing',
        text: "We share order details with our shipping partners (Nova Poshta, Ukrposhta) solely to deliver your order. We don't sell your data to third parties.",
    },
    {
        title: '4. Your rights',
        text: 'You can request a copy of your data, ask us to correct it, or have your account deleted at any time by contacting support@pomu.com.',
    },
    {
        title: '5. Cookies',
        text: 'We use minimal, functional cookies to keep you logged in and remember your cart. We do not use third-party tracking cookies.',
    },
];

const PrivacyPolicy = () => (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Reveal>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Privacy Policy
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 5 }}>
                Last updated: placeholder — to be confirmed with the client.
            </Typography>
        </Reveal>

        <Stack spacing={3}>
            {SECTIONS.map((section, index) => (
                <Reveal key={section.title} delay={index * 0.05}>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>{section.title}</Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {section.text}
                    </Typography>
                </Reveal>
            ))}
        </Stack>
    </Box>
);

export default PrivacyPolicy;
