import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Box,
    Typography,
    Button,
    Paper,
    Chip
} from '@mui/material';

import Grid from '@mui/material/Grid';

import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
                        md: 10,
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
                            md: '4.5rem',
                        },
                    }}
                >
                    Cosmetics Store
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 700,
                        mx: 'auto',
                        mb: 4,
                        fontSize: '1.1rem',
                    }}
                >
                    Premium skincare, beauty and
                    cosmetic products carefully
                    selected for your everyday
                    routine.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <Button
                        component={Link}
                        to="/catalog"
                        variant="contained"
                        size="large"
                        endIcon={
                            <ArrowForwardIcon />
                        }
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                        }}
                    >
                        Browse Catalog
                    </Button>

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
                        View Products
                    </Button>
                </Box>

                <Box
                    sx={{
                        mt: 6,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: {
                            xs: 4,
                            md: 10,
                        },
                        flexWrap: 'wrap',
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            {products.length}+
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Products
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            {categories.length}+
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Categories
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            24/7
                        </Typography>

                        <Typography
                            color="text.secondary"
                        >
                            Support
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {categories.length > 0 && (

                <Box sx={{ mb: 8 }}>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                        }}
                    >
                        Categories
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Browse products by category
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                        }}
                    >
                        {categories.map(
                            category => (

                                <Chip
                                    key={category}
                                    label={category}
                                    component={Link}
                                    to="/catalog"
                                    clickable
                                    sx={{
                                        height: 40,
                                        borderRadius: 20,
                                        bgcolor: '#fafafa',

                                        '&:hover': {
                                            bgcolor: '#f0f0f0',
                                        },
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

            <Box sx={{ mb: 8 }}>

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        mb: 4,
                        textAlign: 'center',
                    }}
                >
                    Why Choose Us
                </Typography>

                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: '1px solid #eee',
                                borderRadius: 5,
                                textAlign: 'center',
                            }}
                        >
                            <LocalShippingOutlinedIcon />

                            <Typography
                                mt={2}
                                fontWeight={700}
                            >
                                Fast Delivery
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Fast and reliable
                                shipping for all
                                orders.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: '1px solid #eee',
                                borderRadius: 5,
                                textAlign: 'center',
                            }}
                        >
                            <VerifiedOutlinedIcon />

                            <Typography
                                mt={2}
                                fontWeight={700}
                            >
                                Original Products
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Only authentic and
                                trusted brands.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                border: '1px solid #eee',
                                borderRadius: 5,
                                textAlign: 'center',
                            }}
                        >
                            <SupportAgentOutlinedIcon />

                            <Typography
                                mt={2}
                                fontWeight={700}
                            >
                                Support
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Friendly customer
                                service whenever
                                you need help.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

            </Box>

            <Paper
                elevation={0}
                sx={{
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
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                    }}
                >
                    Ready To Explore?
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{
                        maxWidth: 600,
                        mx: 'auto',
                        mb: 4,
                    }}
                >
                    Browse our collection and
                    discover products that fit
                    your beauty routine.
                </Typography>

                <Button
                    component={Link}
                    to="/catalog"
                    variant="contained"
                    size="large"
                    endIcon={
                        <ArrowForwardIcon />
                    }
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                    }}
                >
                    Shop Now
                </Button>
            </Paper>
        </>
    );
};

export default Home;
