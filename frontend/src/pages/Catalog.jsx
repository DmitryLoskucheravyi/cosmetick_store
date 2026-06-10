import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Typography,
    CircularProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import ProductCard from '../components/common/ProductCard';

import {
    getProducts,
} from '../redux/product/productSlice';

const Catalog = () => {

    const dispatch = useDispatch();

    const {
        products,
        loading,
    } = useSelector(
        state => state.products
    );

    useEffect(() => {

        dispatch(getProducts());

    }, [dispatch]);

    if (loading) {

        return <CircularProgress />;
    }

    return (
        <>
            <Typography
                variant="h4"
                sx={{ mb: 4 }}
            >
                Catalog
            </Typography>

            <Grid
                container
                spacing={3}
            >
                {products.map(product => (

                    <Grid
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4
                        }}
                        key={product.id}
                    >
                        <ProductCard
                            product={product}
                        />
                    </Grid>

                ))}
            </Grid>
        </>
    );
};

export default Catalog;