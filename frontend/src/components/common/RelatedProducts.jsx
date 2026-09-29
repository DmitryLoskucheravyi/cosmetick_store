import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';

import Section from './Section';
import ProductCard from './ProductCard';
import Reveal from '../../motion/Reveal';
import { getRelatedProducts } from '../../redux/product/productSlice';

// Shared by ProductDetails ("You may also like") and Cart (cross-sell):
// same category, current/cart product excluded, capped at 6 by the thunk.
const RelatedProducts = ({ categoryId, excludeId, title = 'You may also like' }) => {
    const dispatch = useDispatch();
    const { related, relatedLoading } = useSelector((state) => state.products);

    useEffect(() => {
        if (categoryId) {
            dispatch(getRelatedProducts({ categoryId, excludeId }));
        }
    }, [dispatch, categoryId, excludeId]);

    if (!relatedLoading && related.length === 0) {
        return null;
    }

    return (
        <Section title={title}>
            <Grid container spacing={3}>
                {related.map((product, index) => (
                    <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Reveal margin="-40px" delay={index * 0.05}>
                            <ProductCard product={product} />
                        </Reveal>
                    </Grid>
                ))}
            </Grid>
        </Section>
    );
};

export default RelatedProducts;
