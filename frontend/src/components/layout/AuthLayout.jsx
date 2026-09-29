import { Box, Typography } from '@mui/material';
import OrganicPanel from '../common/OrganicPanel';
import Reveal from '../../motion/Reveal';
import { colors } from '../../theme/theme';

// Hand-scattered "pomu" letterforms dropped onto the blob, each with its
// own tilt/offset rather than sitting in a neat row or a card.
const brandLetters = [
    { ch: 'p', top: '9%', left: '28%', rotate: -12, size: '7.5rem' },
    { ch: 'o', top: '29%', left: '56%', rotate: 10, size: '6rem' },
    { ch: 'm', top: '47%', left: '13%', rotate: 6, size: '7rem' },
    { ch: 'u', top: '63%', left: '42%', rotate: -9, size: '6rem' },
];

const BrandMark = ({ flip }) => (
    <Box role="img" aria-label="pomu" sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {brandLetters.map(({ ch, top, left, rotate, size }) => (
            <Typography
                key={ch}
                aria-hidden
                component="span"
                sx={{
                    position: 'absolute',
                    top,
                    [flip ? 'right' : 'left']: left,
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                    fontWeight: 800,
                    fontSize: size,
                    lineHeight: 1,
                    color: colors.punch,
                    transform: `rotate(${flip ? -rotate : rotate}deg)`,
                    userSelect: 'none',
                }}
            >
                {ch}
            </Typography>
        ))}
    </Box>
);

// Shared shell for Login and Register: a branded panel plus a form slot,
// so the two pages can't drift into two different auth experiences.
// `flip` mirrors the decorative panel so /login and /register read as a
// pair rather than clones.
const AuthLayout = ({ title, description, children, footer, flip = false }) => (
    <Box
        sx={{
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
        }}
    >
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <OrganicPanel
                flip={flip}
                illustrationSrc="/auth-illustration.png"
                illustrationSourcesAvif="/auth-illustration.avif"
                illustrationSourcesWebp="/auth-illustration.webp"
            >
                <BrandMark flip={flip} />
            </OrganicPanel>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'background.paper' }}>
            <Reveal margin="0px">
                <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {title}
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 4 }}>
                        {description}
                    </Typography>

                    {children}

                    {footer && <Box sx={{ mt: 3, textAlign: 'center' }}>{footer}</Box>}
                </Box>
            </Reveal>
        </Box>
    </Box>
);

export default AuthLayout;
