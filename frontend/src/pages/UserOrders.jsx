import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Typography,
    Paper,
    Stack,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    Avatar,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

import { getMyOrders, getOrderById, clearSelectedOrder } from '../redux/order/orderSlice';
import StatusBadge from '../components/common/StatusBadge';
import PriceTag from '../components/common/PriceTag';
import EmptyState from '../components/common/EmptyState';
import { resolveImageUrl } from '../utils/imageUrl';
import { colors } from '../theme/theme';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_STEP_LABELS = {
    pending: 'Accepted',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
};

const OrderStatusStepper = ({ status }) => {
    if (status === 'cancelled') {
        return <StatusBadge status={status} sx={{ mb: 3 }} />;
    }

    return (
        <Stepper activeStep={STATUS_STEPS.indexOf(status)} alternativeLabel sx={{ mb: 3 }}>
            {STATUS_STEPS.map((step) => (
                <Step key={step}>
                    <StepLabel>{STATUS_STEP_LABELS[step]}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

const UserOrders = () => {
    const dispatch = useDispatch();

    const { orders, selectedOrder, loading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!orders.length) {
        return (
            <EmptyState
                icon={<ReceiptLongOutlinedIcon fontSize="inherit" />}
                title="No orders yet"
                description="Once you check out, your orders will show up here."
                actionLabel="Browse the catalog"
                actionTo="/catalog"
            />
        );
    }

    return (
        <>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                My orders
            </Typography>

            <Stack spacing={2}>
                {orders.map((order) => (
                    <Paper
                        key={order.id}
                        variant="outlined"
                        onClick={() => dispatch(getOrderById(order.id))}
                        sx={{
                            p: 2,
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: '.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 20px rgba(28,21,18,.06)',
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Order #{order.id}
                                </Typography>
                                <Typography color="text.secondary">
                                    {new Date(order.createdAt).toLocaleDateString('en-US')}
                                </Typography>
                            </Box>

                            <Box sx={{ textAlign: 'right' }}>
                                <StatusBadge status={order.status} size="small" />
                                <PriceTag value={order.totalPrice} sx={{ mt: 1 }} />
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Stack>

            <Dialog open={!!selectedOrder} onClose={() => dispatch(clearSelectedOrder())} fullWidth maxWidth="md">
                <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>

                <DialogContent>
                    {selectedOrder && (
                        <>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                {new Date(selectedOrder.createdAt).toLocaleString('en-US')}
                            </Typography>

                            <OrderStatusStepper status={selectedOrder.status} />

                            {selectedOrder.shippingAddress && (
                                <>
                                    <Divider sx={{ mb: 2 }} />

                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Delivery
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {selectedOrder.shippingName} · {selectedOrder.shippingPhone}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                                        {selectedOrder.shippingCity}, {selectedOrder.shippingAddress}
                                    </Typography>
                                </>
                            )}

                            <Divider sx={{ mb: 3 }} />

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Products
                            </Typography>

                            <Grid container spacing={2}>
                                {selectedOrder.items?.map((item) => (
                                    <Grid key={item.id} size={{ xs: 12 }}>
                                        <Paper
                                            variant="outlined"
                                            sx={{ p: 1.5, borderRadius: '12px', display: 'flex', gap: 2, alignItems: 'center' }}
                                        >
                                            <Avatar
                                                src={resolveImageUrl(item.image)}
                                                variant="rounded"
                                                sx={{ width: 70, height: 70 }}
                                            />

                                            <Box sx={{ flex: 1 }}>
                                                <Typography fontWeight={600}>{item.title}</Typography>
                                                <Typography color="text.secondary">Quantity: {item.quantity}</Typography>
                                            </Box>

                                            <PriceTag value={item.price} variant="body1" />
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Stack spacing={1} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Subtotal</Typography>
                                    <PriceTag value={selectedOrder.subtotal} variant="body1" />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Shipping</Typography>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {selectedOrder.shippingCost === 0 ? 'Free' : `${selectedOrder.shippingCost} UAH`}
                                    </Typography>
                                </Box>
                                {selectedOrder.discount > 0 && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: colors.mint }}>Discount ({selectedOrder.promoCode})</Typography>
                                        <Typography sx={{ fontWeight: 700, color: colors.mint }}>
                                            −{selectedOrder.discount} UAH
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>

                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" color="text.secondary" component="span" sx={{ mr: 1 }}>
                                    Total:
                                </Typography>
                                <PriceTag value={selectedOrder.totalPrice} variant="h5" />
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserOrders;
