import { Box, Typography, Stack } from '@mui/material';
import Reveal from '../motion/Reveal';

// Placeholder legal copy — replace with the client's reviewed terms before launch.
const SECTIONS = [
    {
        title: '1. Orders',
        text: 'By placing an order you confirm the shipping details you provided are accurate. We reserve the right to cancel an order if a product becomes unavailable after purchase, with a full refund.',
    },
    {
        title: '2. Pricing & payment',
        text: 'All prices are listed in Ukrainian hryvnia (UAH) and include applicable taxes. Payment is accepted by cash on delivery or online card payment, depending on the method chosen at checkout.',
    },
    {
        title: '3. Delivery',
        text: 'Shipping is free on orders over 1000 UAH; a flat delivery fee applies below that threshold. Delivery times depend on the carrier and destination selected at checkout.',
    },
    {
        title: '4. Returns',
        text: 'Unopened products can be returned within 14 days of delivery for a full refund. Contact support@pomu.com to start a return.',
    },
    {
        title: '5. Promo codes',
        text: 'Promo codes apply to the order subtotal, cannot be combined, and may be withdrawn at any time without notice.',
    },
];

const Terms = () => (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Reveal>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Terms of Use
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

export default Terms;
