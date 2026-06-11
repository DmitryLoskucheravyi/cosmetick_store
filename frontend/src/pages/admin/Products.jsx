import { useEffect, useState } from 'react';

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

import {
    getCategories,
} from '../../redux/category/categorySlice';

import ProductFilters from './ProductFilters';
const Products = () => {


    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        stock: '',
        sort: 'newest',
    });

    const [appliedFilters, setAppliedFilters] =
        useState(filters);

    const dispatch = useDispatch()

    const {
        products,
        loading,
    } = useSelector(
        state => state.products
    );


    const { categories } = useSelector(
        state => state.categories
    );


    useEffect(() => {

        dispatch(
            getCategories()
        );

    }, [dispatch]);

    useEffect(() => {

        dispatch(
            getProducts({
                ...appliedFilters,
                page: 1,
                limit: 10,
            })
        );

    }, [dispatch, appliedFilters]);

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
            <ProductFilters
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                setAppliedFilters={setAppliedFilters}
            />

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