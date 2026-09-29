import { Box, Rating, Typography } from '@mui/material';

// Compact "stars + count" used on both the catalog card and the product
// page, so a product's rating always reads the same way everywhere.
const RatingSummary = ({ average = 0, count = 0, size = 'small', showEmpty = false }) => {
    if (!count) {
        return showEmpty ? (
            <Typography variant="body2" color="text.secondary">
                No reviews yet
            </Typography>
        ) : null;
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Rating value={average} precision={0.5} readOnly size={size} />
            <Typography variant="body2" color="text.secondary">
                {average.toFixed(1)} ({count})
            </Typography>
        </Box>
    );
};

export default RatingSummary;
