import { useId } from 'react';
import { Box } from '@mui/material';
import { colors } from '../../theme/theme';

// One irregular "island" blob — bays and a peninsula, not a border-radius
// blend — drawn in objectBoundingBox units (0–1) so it rescales with
// whatever box it's clipped into. `flip` mirrors it in place via an SVG
// transform instead of a second hand-authored path.
const BLOB_PATH = [
    'M0.50,0.03',
    'C0.66,0.03 0.79,0.09 0.83,0.21',
    'C0.87,0.33 0.77,0.39 0.87,0.49',
    'C0.97,0.59 0.93,0.73 0.81,0.79',
    'C0.71,0.84 0.65,0.76 0.54,0.81',
    'C0.45,0.85 0.43,0.96 0.29,0.95',
    'C0.15,0.94 0.08,0.83 0.13,0.71',
    'C0.18,0.61 0.07,0.57 0.05,0.45',
    'C0.03,0.33 0.13,0.27 0.17,0.17',
    'C0.21,0.07 0.34,0.03 0.50,0.03 Z',
].join(' ');

// Reusable decorative panel for auth screens: illustration → white organic
// blob → freeform brand mark scattered across the blob's body (children
// position themselves absolutely; this just hands them the clipped area).
const OrganicPanel = ({ illustrationSrc, illustrationSourcesAvif, illustrationSourcesWebp, flip = false, children, sx }) => {
    const rawId = useId();
    const clipId = `organic-panel-blob-${rawId.replace(/:/g, '')}`;

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                background: `linear-gradient(160deg, ${colors.punch}, ${colors.blush})`,
                ...sx,
            }}
        >
            {illustrationSrc && (
                <Box component="picture" aria-hidden sx={{ position: 'absolute', inset: 0, display: 'block' }}>
                    {illustrationSourcesAvif && <source srcSet={illustrationSourcesAvif} type="image/avif" />}
                    {illustrationSourcesWebp && <source srcSet={illustrationSourcesWebp} type="image/webp" />}
                    <Box
                        component="img"
                        src={illustrationSrc}
                        alt=""
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                </Box>
            )}

            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
                <defs>
                    <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                        <path d={BLOB_PATH} transform={flip ? 'translate(1,0) scale(-1,1)' : undefined} />
                    </clipPath>
                </defs>
            </svg>

            <Box
                aria-hidden
                sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: colors.paper,
                    clipPath: `url(#${clipId})`,
                }}
            />

            {children && (
                <Box sx={{ position: 'absolute', inset: 0 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
};

export default OrganicPanel;
