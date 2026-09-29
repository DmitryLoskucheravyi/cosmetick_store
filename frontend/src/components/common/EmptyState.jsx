import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Blob from './Blob';
import { colors } from '../../theme/theme';

// A single reusable "nothing here" moment: cart, orders, search results.
// Treated as an invitation to act, per the interface's own voice — not an apology.
const EmptyState = ({ icon, title, description, actionLabel, actionTo, onAction, color = colors.punchSoft }) => (
    <Box
        sx={{
            textAlign: 'center',
            py: { xs: 8, md: 10 },
            px: 3,
        }}
    >
        <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mb: 3 }}>
            <Blob color={color} size={120} sx={{ position: 'absolute', inset: 0 }} />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    color: 'text.primary',
                }}
            >
                {icon}
            </Box>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {title}
        </Typography>

        {description && (
            <Typography color="text.secondary" sx={{ maxWidth: 380, mx: 'auto', mb: actionLabel ? 3 : 0 }}>
                {description}
            </Typography>
        )}

        {actionLabel && actionTo && (
            <Button component={Link} to={actionTo} variant="contained" size="large">
                {actionLabel}
            </Button>
        )}

        {actionLabel && onAction && (
            <Button onClick={onAction} variant="contained" size="large">
                {actionLabel}
            </Button>
        )}
    </Box>
);

export default EmptyState;
