import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Typography,
    Paper,
    Stack,
    Box,
    Button,
    Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

import { removeFromCart, updateQuantity } from '../redux/cart/cartSlice';
import EmptyState from '../components/common/EmptyState';
import PriceTag from '../components/common/PriceTag';
import QuantityStepper from '../components/common/QuantityStepper';
import RelatedProducts from '../components/common/RelatedProducts';
import { colors } from '../theme/theme';
import { resolveImageUrl } from '../utils/imageUrl';

const FREE_SHIPPING_THRESHOLD = 1000;

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector((state) => state.cart.items || []);
    const totalPrice = items.reduce((sum, item) => sum + Number(item.total), 0);
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);

    if (!items.length) {
        return (
            <EmptyState
                icon={<ShoppingBagOutlinedIcon fontSize="inherit" />}
                title="Your cart is empty"
                description="Add something from the catalog to see it here."
                actionLabel="Browse the catalog"
                actionTo="/catalog"
            />
        );
    }

    return (
        <>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                Shopping cart
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                        <AnimatePresence initial={false}>
                            {items.map((item) => (
                                <motion.div
                                    key={item.productId}
                                    layout
                                    initial={{ opacity: 0, y: -12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -24, transition: { duration: 0.25 } }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: '16px' }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Box
                                                component="img"
                                                src={resolveImageUrl(item.image, 'https://placehold.co/120x120')}
                                                alt={item.title}
                                                sx={{
                                                    width: 90,
                                                    height: 90,
                                                    objectFit: 'contain',
                                                    borderRadius: '10px',
                                                    bgcolor: colors.canvas,
                                                    p: 1,
                                                }}
                                            />

                                            <Box sx={{ flexGrow: 1, minWidth: 160 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    {item.title}
                                                </Typography>

                                                <QuantityStepper
                                                    value={item.quantity}
                                                    onDecrease={() =>
                                                        dispatch(
                                                            updateQuantity({
                                                                productId: item.productId,
                                                                quantity: item.quantity - 1,
                                                            })
                                                        )
                                                    }
                                                    onIncrease={() =>
                                                        dispatch(
                                                            updateQuantity({
                                                                productId: item.productId,
                                                                quantity: item.quantity + 1,
                                                            })
                                                        )
                                                    }
                                                />
                                            </Box>

                                            <Box sx={{ textAlign: 'right' }}>
                                                <PriceTag value={item.total} sx={{ mb: 0.5 }} />

                                                <Button
                                                    color="error"
                                                    size="small"
                                                    onClick={() => dispatch(removeFromCart(item.productId))}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', position: 'sticky', top: 100 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Order summary
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <PriceTag value={totalPrice} />
                        </Box>

                        {amountToFreeShipping > 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Add {amountToFreeShipping} UAH more for free shipping.
                            </Typography>
                        ) : (
                            <Typography variant="body2" sx={{ mb: 2, color: colors.mint, fontWeight: 600 }}>
                                You've unlocked free shipping!
                            </Typography>
                        )}

                        <Button fullWidth variant="contained" size="large" onClick={() => navigate('/checkout')}>
                            Checkout
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mt: { xs: 6, md: 8 } }}>
                <RelatedProducts
                    categoryId={items[0]?.categoryId}
                    excludeId={items[0]?.productId}
                    title="You might also like"
                />
            </Box>
        </>
    );
};

export default Cart;
