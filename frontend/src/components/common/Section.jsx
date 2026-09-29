import { Box, Typography, Button } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Link } from 'react-router-dom';

// Consistent heading + optional "view all" action for homepage sections,
// so each block doesn't reinvent its own header markup.
const Section = ({ title, subtitle, actionLabel, actionTo, children, sx }) => (
    <Box component="section" sx={{ mb: { xs: 5, md: 7 }, ...sx }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: 2,
                mb: 3,
            }}
        >
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>

            {actionLabel && actionTo && (
                <Button
                    component={Link}
                    to={actionTo}
                    endIcon={<ArrowOutwardIcon sx={{ fontSize: 16, transition: 'transform .25s' }} />}
                    sx={{
                        color: 'text.primary',
                        '&:hover .MuiButton-endIcon': { transform: 'translate(3px, -3px)' },
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>

        {children}
    </Box>
);

export default Section;
