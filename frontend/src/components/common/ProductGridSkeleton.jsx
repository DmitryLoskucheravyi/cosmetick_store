import Grid from '@mui/material/Grid';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductGridSkeleton = ({ count = 6 }) => (
    <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProductCardSkeleton />
            </Grid>
        ))}
    </Grid>
);

export default ProductGridSkeleton;
