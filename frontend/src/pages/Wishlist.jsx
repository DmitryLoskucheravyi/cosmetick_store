import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { Typography, Paper, Stack, Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { removeFromWishlist } from '../redux/wishlist/wishlistSlice';
import { useAddToCart } from '../hooks/useAddToCart';
import EmptyState from '../components/common/EmptyState';
import PriceTag from '../components/common/PriceTag';
import { colors } from '../theme/theme';
import { resolveImageUrl } from '../utils/imageUrl';

const Wishlist = () => {
    const dispatch = useDispatch();
    const addToCart = useAddToCart();
    const items = useSelector((state) => state.wishlist.items);

    if (!items.length) {
        return (
            <EmptyState
                icon={<FavoriteBorderIcon fontSize="inherit" />}
                title="Your wishlist is empty"
                description="Save products you like by tapping the heart on any product card."
                actionLabel="Browse the catalog"
                actionTo="/catalog"
            />
        );
    }

    return (
        <>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                Wishlist
            </Typography>

            <Grid container spacing={3}>
                {items.map((item) => {
                    const outOfStock = Number(item.stock) <= 0;

                    return (
                        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', height: '100%' }}>
                                <Stack spacing={1.5} sx={{ height: '100%' }}>
                                    <Box
                                        component={Link}
                                        to={`/products/${item.id}`}
                                        sx={{
                                            display: 'block',
                                            borderRadius: '10px',
                                            bgcolor: colors.canvas,
                                            p: 1,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={resolveImageUrl(item.image, 'https://placehold.co/300x300')}
                                            alt={item.title}
                                            sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'contain', display: 'block' }}
                                        />
                                    </Box>

                                    <Typography
                                        component={Link}
                                        to={`/products/${item.id}`}
                                        sx={{ fontWeight: 700, color: 'text.primary', textDecoration: 'none' }}
                                    >
                                        {item.title}
                                    </Typography>

                                    <PriceTag value={item.price} />

                                    <Box sx={{ flexGrow: 1 }} />

                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            disabled={outOfStock}
                                            onClick={() => addToCart(item.id)}
                                        >
                                            {outOfStock ? 'Sold out' : 'Add to cart'}
                                        </Button>

                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() => dispatch(removeFromWishlist(item.id))}
                                        >
                                            Remove
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};

export default Wishlist;
