import { Card, Box, Skeleton } from '@mui/material';

// Mirrors ProductCard's layout (image, title, rating, description, price
// row) so swapping skeleton -> real card doesn't shift the page height.
const ProductCardSkeleton = () => (
    <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '1 / 1' }} />

        <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="75%" height={28} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="45%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" width={64} height={36} />
                <Skeleton variant="rounded" width={84} height={32} />
            </Box>
        </Box>
    </Card>
);

export default ProductCardSkeleton;
