import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
} from '@mui/material';

import Grid from '@mui/material/Grid';

import { Link } from 'react-router-dom';

import ProductCard from '../components/common/ProductCard';

import {
    getProducts,
} from '../redux/product/productSlice';

const Home = () => {

    const dispatch = useDispatch();

    const {
        products,
    } = useSelector(
        state => state.products
    );

    useEffect(() => {

        if (!products.length) {
            dispatch(
                getProducts()
            );
        }

    }, [dispatch]);

    const featuredProducts =
        products.slice(0, 6);

    const categories = [
        ...new Set(
            products
                .map(
                    product =>
                        product.categoryName
                )
                .filter(Boolean)
        ),
    ].slice(0, 6);

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    mb: 8,
                    p: {
                        xs: 5,
                        md: 8,
                    },
                    border: '1px solid #eee',
                    borderRadius: 6,
                    textAlign: 'center',
                    bgcolor: 'white',
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: {
                            xs: '2.5rem',
                            md: '4rem',
                        },
                    }}
                >
                    Cosmetics Store
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 650,
                        mx: 'auto',
                        mb: 4,
                        fontSize: '1.05rem',
                    }}
                >
                    Discover carefully selected
                    cosmetics, skincare and beauty
                    products for your daily routine.
                </Typography>

                <Button
                    component={Link}
                    to="/catalog"
                    variant="contained"
                    size="large"
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                    }}
                >
                    Browse Catalog
                </Button>
            </Paper>

            {categories.length > 0 && (

                <Box sx={{ mb: 8 }}>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                        }}
                    >
                        Categories
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            flexWrap: 'wrap',
                        }}
                    >
                        {categories.map(
                            category => (

                                <Chip
                                    key={category}
                                    label={category}
                                    clickable
                                    component={Link}
                                    to="/catalog"
                                    sx={{
                                        borderRadius: 3,
                                        height: 38,
                                    }}
                                />

                            )
                        )}
                    </Box>

                </Box>

            )}

            <Box sx={{ mb: 8 }}>

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
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        New Arrivals
                    </Typography>

                    <Button
                        component={Link}
                        to="/catalog"
                        sx={{
                            textTransform: 'none',
                        }}
                    >
                        View All
                    </Button>
                </Box>

                <Grid
                    container
                    spacing={3}
                >
                    {featuredProducts.map(
                        product => (

                            <Grid
                                key={product.id}
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4,
                                }}
                            >
                                <ProductCard
                                    product={product}
                                />
                            </Grid>

                        )
                    )}
                </Grid>

            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: {
                        xs: 4,
                        md: 6,
                    },
                    border: '1px solid #eee',
                    borderRadius: 6,
                    textAlign: 'center',
                    bgcolor: 'white',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                    }}
                >
                    Explore the full collection
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 500,
                        mx: 'auto',
                        mb: 4,
                    }}
                >
                    Browse all available products
                    and find exactly what you're
                    looking for.
                </Typography>

                <Button
                    component={Link}
                    to="/catalog"
                    variant="outlined"
                    size="large"
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                    }}
                >
                    View All Products
                </Button>
            </Paper>
        </>
    );
};

export default Home;