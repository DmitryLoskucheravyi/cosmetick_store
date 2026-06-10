import {
    Typography,
    Paper,
    Button,
    Stack,
} from '@mui/material';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    removeFromCart,
} from '../redux/cart/cartSlice';

const Cart = () => {

    const dispatch = useDispatch();
    const cart = useSelector(
        state => state.cart
    );

    console.log(cart);

    const items = cart?.items || [];

    const totalPrice = items.reduce(
        (sum, item) =>
            sum + Number(item.total),
        0
    );

    return (
        <>
            <Typography
                variant="h4"
                sx={{ mb: 4 }}
            >
                Cart
            </Typography>

            <Stack spacing={2}>

                {items.map(item => (

                    <Paper
                        key={item.productId}
                        sx={{
                            p: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                        >
                            {item.title}
                        </Typography>

                        <Typography>
                            Quantity:
                            {' '}
                            {item.quantity}
                        </Typography>

                        <Typography>
                            Price:
                            {' '}
                            ${item.total}
                        </Typography>

                        <Button
                            color="error"
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

                    </Paper>

                ))}

                <Typography
                    variant="h5"
                >
                    Total:
                    {' '}
                    ${totalPrice.toFixed(2)}
                </Typography>

            </Stack>
        </>
    );
};

export default Cart;