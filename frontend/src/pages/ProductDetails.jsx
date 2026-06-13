import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addToCart } from '../redux/cart/cartSlice';
import {
    Grid,
    Typography,
    Button,
    Paper,
    CircularProgress,
} from '@mui/material';

import {
    getProductById,
} from '../redux/product/productDetailsSlice';

const ProductDetails = () => {

    const { id } = useParams();
    const { user } = useSelector(
        state => state.auth
    );
    const dispatch = useDispatch();

    const {
        product,
        loading,
    } = useSelector(
        state => state.productDetails
    );

    useEffect(() => {

        dispatch(
            getProductById(id)
        );

    }, [dispatch, id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!product) {
        return null;
    }

    return (
        <Paper sx={{ p: 4 }}>

            <Grid
                container
                spacing={4}
            >

                <Grid
                    size={{
                        xs: 12,
                        md: 6
                    }}
                >
                    <img
                        src={
                            product.image
                                ? `https://cosmetics.freepage.cc/api${product.image}`
                                : 'https://placehold.co/600x400'
                        }
                        alt={product.title}
                        style={{
                            width: '100%',
                            borderRadius: '12px',
                        }}
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        md: 6
                    }}
                >
                    <Typography
                        variant="h3"
                        gutterBottom
                    >
                        {product.title}
                    </Typography>

                    <Typography
                        sx={{
                            mb: 2,
                        }}
                    >
                        {product.description}
                    </Typography>

                    <Typography
                        variant="h5"
                        color="primary"
                    >
                        ${product.price}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 2,
                            mb: 3,
                        }}
                    >
                        Stock: {product.stock}
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            if (!user) {
                                alert(
                                    'Please login first'
                                );
                                return;
                            }
                            dispatch(
                                addToCart(product.id)
                            );
                        }}
                    >
                        Add To Cart
                    </Button>

                </Grid>

            </Grid>

        </Paper>
    );
};

export default ProductDetails;