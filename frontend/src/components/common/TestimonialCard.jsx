import { Paper, Avatar, Typography, Rating, Box } from '@mui/material';
import { colors } from '../../theme/theme';

// Static, presentational — Home passes either real featured reviews (once a
// `GET /reviews?featured=true` endpoint exists) or a placeholder array.
const TestimonialCard = ({ name, rating, text, avatarColor = colors.punchSoft }) => (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Avatar sx={{ bgcolor: avatarColor, color: colors.ink, fontWeight: 700 }}>
                {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
                <Typography sx={{ fontWeight: 700 }}>{name}</Typography>
                <Rating value={rating} precision={0.5} readOnly size="small" />
            </Box>
        </Box>

        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
            "{text}"
        </Typography>
    </Paper>
);

export default TestimonialCard;
