import { useEffect } from 'react';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    Typography,
    Paper,
    Stack,
    Box,
    Button,
    CircularProgress,
} from '@mui/material';

import {
    Link,
} from 'react-router-dom';

import {
    getProducts,
    deleteProduct,
} from '../../redux/product/productSlice';

const Products = () => {

    const dispatch = useDispatch();

    const {
        products,
        loading,
    } = useSelector(
        state => state.products
    );

    useEffect(() => {

        dispatch(
            getProducts()
        );

    }, [dispatch]);

    const handleDelete = (id) => {

        if (
            !window.confirm(
                'Delete this product?'
            )
        ) {
            return;
        }

        dispatch(
            deleteProduct(id)
        );
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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Products
                </Typography>

                <Button
                    variant="contained"
                    component={Link}
                    to="/admin/products/create"
                >
                    Create Product
                </Button>
            </Box>

            <Stack spacing={2}>

                {products.map(product => (

                    <Paper
                        key={product.id}
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
                                >
                                    {product.title}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    $
                                    {product.price}
                                </Typography>

                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                }}
                            >
                                <Button
                                    component={Link}
                                    to={`/admin/products/edit/${product.id}`}
                                >
                                    Edit
                                </Button>

                                <Button
                                    color="error"
                                    onClick={() =>
                                        handleDelete(
                                            product.id
                                        )
                                    }
                                >
                                    Delete
                                </Button>
                            </Box>

                        </Box>
                    </Paper>

                ))}

            </Stack>
        </>
    );
};

export default Products;