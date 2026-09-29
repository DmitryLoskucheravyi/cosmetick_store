import { Box, Typography, Stack } from '@mui/material';
import Reveal from '../motion/Reveal';
import { colors } from '../theme/theme';

const VALUES = [
    { title: 'Curated, not stocked', text: 'Every product on pomu is picked because someone on our team actually reaches for it — not because it sells.' },
    { title: 'Cruelty-free by default', text: 'We only carry brands that don’t test on animals. No exceptions.' },
    { title: 'Fast, honest shipping', text: 'Free delivery over 1000 UAH and tracked orders from the moment they leave our hands.' },
];

// Placeholder copy — swap for the client's real "About" content before launch.
const About = () => (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Reveal>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                About pomu
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 5, lineHeight: 1.8 }}>
                pomu started as a small shelf of skincare and makeup we couldn't stop
                recommending to friends. It grew into a shop, but the standard stayed the
                same: if we wouldn't use it ourselves, it doesn't make the catalog.
            </Typography>
        </Reveal>

        <Stack spacing={3}>
            {VALUES.map((value, index) => (
                <Reveal key={value.title} delay={index * 0.08}>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: index % 2 === 0 ? colors.canvas : 'background.paper',
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, mb: 1 }}>{value.title}</Typography>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {value.text}
                        </Typography>
                    </Box>
                </Reveal>
            ))}
        </Stack>
    </Box>
);

export default About;
