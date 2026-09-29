import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import { Box, Typography, Paper, Stack, Button, Divider, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import { getOrderById, clearSelectedOrder } from '../redux/order/orderSlice';
import PriceTag from '../components/common/PriceTag';
import StatusBadge from '../components/common/StatusBadge';
import { colors } from '../theme/theme';

const OrderSuccess = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { selectedOrder: order, loading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getOrderById(id));
        return () => dispatch(clearSelectedOrder());
    }, [dispatch, id]);

    if (loading || !order) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center' }}>
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    bgcolor: colors.mintSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                }}
            >
                <CheckCircleOutlineIcon sx={{ fontSize: 40, color: colors.mint }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Order placed!
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Order #{order.id} · {new Date(order.createdAt).toLocaleString('en-US')}
            </Typography>

            <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '16px', textAlign: 'left' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: 700 }}>Status</Typography>
                    <StatusBadge status={order.status} />
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Delivery to</Typography>
                    <Typography color="text.secondary">{order.shippingName} · {order.shippingPhone}</Typography>
                    <Typography color="text.secondary">{order.shippingCity}</Typography>
                    <Typography color="text.secondary">{order.shippingAddress}</Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Subtotal</Typography>
                        <PriceTag value={order.subtotal} variant="body1" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Shipping</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                            {order.shippingCost === 0 ? 'Free' : `${order.shippingCost} UAH`}
                        </Typography>
                    </Box>
                    {order.discount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ color: colors.mint }}>Discount ({order.promoCode})</Typography>
                            <Typography sx={{ fontWeight: 700, color: colors.mint }}>−{order.discount} UAH</Typography>
                        </Box>
                    )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                    <PriceTag value={order.totalPrice} variant="h6" />
                </Box>
            </Paper>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                <Button component={Link} to="/orders" variant="outlined">
                    View my orders
                </Button>
                <Button component={Link} to="/catalog" variant="contained">
                    Continue shopping
                </Button>
            </Stack>
        </Box>
    );
};

export default OrderSuccess;
