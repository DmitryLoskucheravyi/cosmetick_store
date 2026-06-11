import { useEffect } from 'react';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    getAllOrders,
    updateOrderStatus,
} from '../../redux/order/orderSlice';

import {
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    MenuItem,
    Chip,
} from '@mui/material';

const Orders = () => {

    const dispatch = useDispatch();

    const { orders } = useSelector(
        state => state.orders
    );

    useEffect(() => {

        dispatch(
            getAllOrders()
        );

    }, [dispatch]);

    const getStatusColor = (status) => {

        switch (status) {

            case 'pending':
                return 'warning';

            case 'processing':
                return 'info';

            case 'delivered':
                return 'success';

            case 'cancelled':
                return 'error';

            default:
                return 'default';
        }
    };

    return (
        <>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                }}
            >
                Orders
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    border: '1px solid #eee',
                    borderRadius: 4,
                    overflow: 'hidden',
                }}
            >
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>
                                ID
                            </TableCell>

                            <TableCell>
                                Customer
                            </TableCell>

                            <TableCell>
                                Email
                            </TableCell>

                            <TableCell>
                                Total
                            </TableCell>

                            <TableCell>
                                Status
                            </TableCell>

                            <TableCell>
                                Change Status
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {orders?.map(order => (

                            <TableRow
                                key={order.id}
                            >
                                <TableCell>
                                    #{order.id}
                                </TableCell>

                                <TableCell>
                                    {order.name}
                                </TableCell>

                                <TableCell>
                                    {order.email}
                                </TableCell>

                                <TableCell>
                                    {order.totalPrice} UAH
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        color={
                                            getStatusColor(
                                                order.status
                                            )
                                        }
                                    />
                                </TableCell>

                                <TableCell>

                                    <TextField
                                        select
                                        size="small"
                                        value={
                                            order.status
                                        }
                                        onChange={(e) =>
                                            dispatch(
                                                updateOrderStatus({
                                                    orderId:
                                                        order.id,
                                                    status:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                    >
                                        <MenuItem value="pending">
                                            Pending
                                        </MenuItem>

                                        <MenuItem value="processing">
                                            Processing
                                        </MenuItem>

                                        <MenuItem value="delivered">
                                            Delivered
                                        </MenuItem>

                                        <MenuItem value="cancelled">
                                            Cancelled
                                        </MenuItem>
                                    </TextField>

                                </TableCell>
                            </TableRow>

                        ))}

                    </TableBody>

                </Table>
            </Paper>
        </>
    );
};

export default Orders;