import {
    Typography,
    Paper,
    Button,
    Stack,
    Box,
    Grid,
    Divider,
} from '@mui/material';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    removeFromCart,
    updateQuantity
} from '../redux/cart/cartSlice';

import {
    createOrder,
} from '../redux/order/orderSlice';

import {
    useNavigate,
} from 'react-router-dom';

import { useState } from 'react';


const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(
        state => state.cart.items || []
    );
    const totalPrice = items.reduce(
        (sum, item) =>
            sum + Number(item.total),
        0
    );

    const [openCheckout, setOpenCheckout] =
        useState(false);
    const handleCheckout = async () => {

        try {

            await dispatch(
                createOrder()
            ).unwrap();

            setOpenCheckout(false);

            navigate(
                '/orders?success=true'
            );

        } catch (error) {

            console.error(error);
        }
    };

    if (!items.length) {
        return (
            <Box sx={{
                textAlign: "center"
            }} py={10}>
                <Typography variant="h4">
                    Your cart is empty
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Add some products to continue shopping.
                </Typography>
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
                Shopping Cart
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={2}>
                        {items.map(item => (
                            <Paper
                                key={item.productId}
                                elevation={0}
                                sx={{
                                    p: 2,
                                    border: '1px solid #eee',
                                    borderRadius: 4,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        alignItems: 'center',
                                    }}
                                >

                                    <Box
                                        component="img"
                                        src={
                                            item.image
                                                ? `https://cosmetics.freepage.cc/api${item.image}`
                                                : 'https://placehold.co/120x120'
                                        }
                                        alt={item.title}
                                        sx={{
                                            width: 90,
                                            height: 90,
                                            objectFit: 'cover',
                                            borderRadius: 3,
                                            bgcolor: '#fafafa',
                                        }}
                                    />

                                    <Box sx={{ flexGrow: 1 }}>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                            }}
                                        >
                                            {item.title}
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mt: 1,
                                            }}
                                        >

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    minWidth: 36,
                                                }}
                                                disabled={item.quantity <= 1}
                                                onClick={() =>
                                                    dispatch(
                                                        updateQuantity({
                                                            productId: item.productId,
                                                            quantity:
                                                                item.quantity - 1,
                                                        })
                                                    )
                                                }
                                            >
                                                -
                                            </Button>

                                            <Typography
                                                sx={{
                                                    minWidth: 20,
                                                    textAlign: 'center',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.quantity}
                                            </Typography>

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    minWidth: 36,
                                                }}
                                                onClick={() =>
                                                    dispatch(
                                                        updateQuantity({
                                                            productId: item.productId,
                                                            quantity:
                                                                item.quantity + 1,
                                                        })
                                                    )
                                                }
                                            >
                                                +
                                            </Button>

                                        </Box>

                                    </Box>

                                    <Box
                                        sx={{
                                            textAlign: "right"
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                            }}
                                        >
                                            {item.total} UAH
                                        </Typography>

                                        <Button
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                dispatch(
                                                    removeFromCart(
                                                        item.productId
                                                    )
                                                )
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </Box>

                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: '1px solid #eee',
                            borderRadius: 4,
                            position: 'sticky',
                            top: 100,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                            }}
                        >
                            Order Summary
                        </Typography>
                        <Divider
                            sx={{ mb: 2 }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                mb: 3,
                            }}
                        >
                            <Typography>
                                Total
                            </Typography>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {totalPrice.toFixed(2)} UAH
                            </Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={() =>
                                setOpenCheckout(true)
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Checkout
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog
                open={openCheckout}
                onClose={() =>
                    setOpenCheckout(false)
                }
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Confirm Order
                </DialogTitle>

                <DialogContent>

                    <Typography>
                        You are about to place an order for:
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            mt: 2,
                            fontWeight: 700,
                        }}
                    >
                       {totalPrice.toFixed(2)} UAH
                    </Typography>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenCheckout(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCheckout}
                    >
                        Confirm Order
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    );
};

export default Cart;