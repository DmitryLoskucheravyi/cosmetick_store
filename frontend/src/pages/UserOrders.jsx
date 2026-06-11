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
} from '@mui/material';

import {
    getMyOrders,
} from '../redux/order/orderSlice';

const UserOrders = () => {

    const dispatch = useDispatch();

    const {
        orders,
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
                        sx={{
                            p: 3,
                            border: '1px solid #eee',
                            borderRadius: 4,
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
                                    ${order.totalPrice}
                                </Typography>
                            </Box>

                        </Box>
                    </Paper>

                ))}

            </Stack>
        </>
    );
};

export default UserOrders;