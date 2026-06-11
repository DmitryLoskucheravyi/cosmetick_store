import { useEffect } from 'react';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    Typography,
    Paper,
    Stack,
    Chip,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    Avatar,
    Grid,
} from '@mui/material';

import {
    getMyOrders,
    getOrderById,
    clearSelectedOrder,
} from '../redux/order/orderSlice';

const UserOrders = () => {

    const dispatch = useDispatch();

    const {
        orders,
        selectedOrder,
        loading,
    } = useSelector(
        state => state.orders
    );

    useEffect(() => {

        dispatch(
            getMyOrders()
        );

    }, [dispatch]);

    const getStatusColor = (status) => {

        switch (status) {

            case 'pending':
                return 'warning';

            case 'processing':
                return 'info';

            case 'shipped':
                return 'secondary';

            case 'delivered':
                return 'success';

            case 'cancelled':
                return 'error';

            default:
                return 'default';
        }
    };

    if (loading) {

        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 10,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                }}
            >
                My Orders
            </Typography>

            {
                orders.length === 0 && (
                    <Typography
                        color="text.secondary"
                    >
                        You don't have any orders yet.
                    </Typography>
                )
            }

            <Stack spacing={2}>

                {orders.map(order => (

                    <Paper
                        key={order.id}
                        elevation={0}
                        onClick={() =>
                            dispatch(
                                getOrderById(order.id)
                            )
                        }
                        sx={{
                            p: 3,
                            border: '1px solid #eee',
                            borderRadius: 4,
                            cursor: 'pointer',
                            transition: '.2s',

                            '&:hover': {
                                transform:
                                    'translateY(-2px)',
                                boxShadow:
                                    '0 10px 20px rgba(0,0,0,.05)',
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                    }}
                                >
                                    Order #{order.id}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </Typography>

                            </Box>

                            <Box
                                sx={{
                                    textAlign: 'right',
                                }}
                            >
                                <Chip
                                    label={order.status}
                                    color={
                                        getStatusColor(
                                            order.status
                                        )
                                    }
                                    size="small"
                                />

                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontWeight: 700,
                                    }}
                                >
                                    {order.totalPrice} UAH
                                </Typography>
                            </Box>

                        </Box>
                    </Paper>

                ))}

            </Stack>

            <Dialog
                open={!!selectedOrder}
                onClose={() =>
                    dispatch(
                        clearSelectedOrder()
                    )
                }
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Order #
                    {selectedOrder?.id}
                </DialogTitle>

                <DialogContent>

                    {selectedOrder && (
                        <>

                            <Typography
                                color="text.secondary"
                            >
                                {new Date(
                                    selectedOrder.createdAt
                                ).toLocaleString()}
                            </Typography>

                            <Chip
                                label={
                                    selectedOrder.status
                                }
                                color={
                                    getStatusColor(
                                        selectedOrder.status
                                    )
                                }
                                sx={{
                                    mt: 2,
                                    mb: 3,
                                }}
                            />

                            <Divider
                                sx={{
                                    mb: 3,
                                }}
                            />

                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                }}
                            >
                                Products
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >

                                {selectedOrder.items?.map(
                                    item => (

                                        <Grid
                                            key={item.id}
                                            size={{
                                                xs: 12,
                                            }}
                                        >
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    border:
                                                        '1px solid #eee',
                                                    borderRadius: 3,
                                                    display: 'flex',
                                                    gap: 2,
                                                    alignItems:
                                                        'center',
                                                }}
                                            >
                                                <Avatar
                                                    src={
                                                        item.image
                                                            ? `http://localhost:5000${item.image}`
                                                            : ''
                                                    }
                                                    variant="rounded"
                                                    sx={{
                                                        width: 70,
                                                        height: 70,
                                                    }}
                                                />

                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight={600}
                                                    >
                                                        {item.title}
                                                    </Typography>

                                                    <Typography
                                                        color="text.secondary"
                                                    >
                                                        Quantity:
                                                        {' '}
                                                        {item.quantity}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    fontWeight={700}
                                                >
                                                    
                                                    {item.price}

                                                    UAH
                                                </Typography>

                                            </Paper>
                                        </Grid>

                                    )
                                )}

                            </Grid>

                            <Divider
                                sx={{
                                    my: 3,
                                }}
                            />

                            <Box
                                sx={{
                                    textAlign:
                                        'right',
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    Total:
                                    {' '}
                                    
                                    {
                                        selectedOrder.totalPrice
                                    } UAH
                                </Typography>
                            </Box>

                        </>
                    )}

                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserOrders;