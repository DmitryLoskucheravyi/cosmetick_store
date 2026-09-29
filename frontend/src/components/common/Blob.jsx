import { Box } from '@mui/material';

// A recurring organic shape — a stand-in for a smear of product/blush —
// used as a deliberate accent behind hero art and section breaks.
// Kept out of everyday cards so it stays a signature, not a tic.
const SHAPES = [
    '63% 37% 54% 46% / 43% 47% 53% 57%',
    '42% 58% 63% 37% / 51% 42% 58% 49%',
    '58% 42% 39% 61% / 45% 60% 40% 55%',
];

const MAX_SIZE = 180;

const Blob = ({ color, size = 180, variant = 0, sx, ...props }) => {
    const clampedSize = Math.min(size, MAX_SIZE);

    return (
        <Box
            aria-hidden
            sx={{
                display: { xs: 'none', sm: 'block' },
                width: clampedSize,
                height: clampedSize,
                borderRadius: SHAPES[variant % SHAPES.length],
                background: color,
                ...sx,
            }}
            {...props}
        />
    );
};

export default Blob;
