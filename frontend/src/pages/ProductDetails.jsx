import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Box, Typography, Button, Chip, CircularProgress, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import PriceTag from '../components/common/PriceTag';
import QuantityStepper from '../components/common/QuantityStepper';
import ProductGallery from '../components/common/ProductGallery';
import RatingSummary from '../components/common/RatingSummary';
import ProductReviews from '../components/common/ProductReviews';
import RelatedProducts from '../components/common/RelatedProducts';
import Breadcrumbs from '../components/common/Breadcrumbs';
import EmptyState from '../components/common/EmptyState';
import { useAddToCart } from '../hooks/useAddToCart';
import { colors } from '../theme/theme';
import { tagColorFor } from '../utils/tagColor';
import { resolveImageUrl } from '../utils/imageUrl';
import { toggleWishlist } from '../redux/wishlist/wishlistSlice';
import Reveal from '../motion/Reveal';
import MagneticButton from '../motion/MagneticButton';
import { DURATION, EASE } from '../motion/variants';

import { getProductById } from '../redux/product/productDetailsSlice';

// Specs render in a fixed, sensible order when the category provides them;
// anything unrecognized still shows up, just after the common fields.
const SPECS_ORDER = ['Volume', 'Net Weight', 'SPF', 'Concentration', 'Skin Type', 'Hair Type', 'Skin/Beard Type', 'Finish', 'Key Ingredient', 'Notes', 'Shade Range', 'Scent', 'Water Resistant', 'Suitable For', 'Dries In', 'Certification', 'Free From', 'How To Use', 'Cruelty-Free', 'Packaging'];

const ProductSpecs = ({ specs }) => {
    const entries = Object.entries(specs || {}).sort(
        ([a], [b]) => SPECS_ORDER.indexOf(a) - SPECS_ORDER.indexOf(b)
    );

    if (!entries.length) return null;

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Details
            </Typography>
            <Box
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '16px',
                    overflow: 'hidden',
                }}
            >
                {entries.map(([label, value], index) => (
                    <Box
                        key={label}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                            px: { xs: 2.5, sm: 3 },
                            py: 2,
                            bgcolor: index % 2 === 0 ? 'background.paper' : colors.canvas,
                        }}
                    >
                        <Typography color="text.secondary">{label}</Typography>
                        <Typography sx={{ fontWeight: 600, textAlign: 'right' }}>{value}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

// A small "stock health" meter — fills in once on mount instead of just
// stating the number, capped so a stock of 3000 doesn't read the same
// visual weight as a stock of 30.
const StockMeter = ({ stock }) => {
    const level = Math.max(0, Math.min(1, stock / 30));
    const color = stock <= 0 ? colors.punchDark : stock < 10 ? colors.zap : colors.mint;
    const label = stock <= 0 ? 'Out of stock' : stock < 10 ? `Only ${stock} left` : `${stock} in stock`;

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color, mb: 0.75 }}>
                {label}
            </Typography>
            <Box sx={{ height: 6, borderRadius: 999, bgcolor: 'divider', overflow: 'hidden', maxWidth: 220 }}>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: level }}
                    transition={{ duration: DURATION.slow, ease: EASE }}
                    style={{ height: '100%', width: '100%', transformOrigin: 'left', background: color }}
                />
            </Box>
        </Box>
    );
};

// Its own component (keyed by product id below) so quantity resets
// automatically when navigating between products, without an effect.
const PurchaseControls = ({ product }) => {
    const dispatch = useDispatch();
    const addToCart = useAddToCart();
    const [quantity, setQuantity] = useState(1);
    const outOfStock = Number(product.stock) <= 0;
    const isWishlisted = useSelector((state) =>
        state.wishlist.items.some((item) => item.id === product.id)
    );

    const handleShare = async () => {
        const shareData = {
            title: product.title,
            text: product.title,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User cancelled the share sheet — nothing to do.
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        } catch {
            toast.error('Could not copy the link');
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <QuantityStepper
                value={quantity}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onIncrease={() => setQuantity((q) => Math.min(Number(product.stock) || q, q + 1))}
                max={Number(product.stock) || undefined}
            />

            <MagneticButton>
                <Button
                    variant="contained"
                    size="large"
                    disabled={outOfStock}
                    onClick={() => addToCart(product.id, quantity)}
                >
                    {outOfStock ? 'Sold out' : 'Add to cart'}
                </Button>
            </MagneticButton>

            <IconButton
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => dispatch(toggleWishlist(product))}
                sx={{
                    border: '1.5px solid',
                    borderColor: 'divider',
                    width: 48,
                    height: 48,
                }}
            >
                {isWishlisted ? (
                    <FavoriteIcon sx={{ color: colors.punch }} />
                ) : (
                    <FavoriteBorderIcon />
                )}
            </IconButton>

            <IconButton
                aria-label="Share this product"
                onClick={handleShare}
                sx={{
                    border: '1.5px solid',
                    borderColor: 'divider',
                    width: 48,
                    height: 48,
                }}
            >
                <ShareOutlinedIcon />
            </IconButton>
        </Box>
    );
};

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { product, loading } = useSelector((state) => state.productDetails);

    useEffect(() => {
        dispatch(getProductById(id));
    }, [dispatch, id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <EmptyState
                icon={<SearchOffOutlinedIcon fontSize="inherit" />}
                title="Product not found"
                description="This product may have been removed, or the link is incorrect."
                actionLabel="Back to catalog"
                actionTo="/catalog"
            />
        );
    }

    return (
        <>
            <Breadcrumbs
                items={[
                    { label: 'Home', to: '/' },
                    { label: 'Catalog', to: '/catalog' },
                    ...(product.categoryName
                        ? [{ label: product.categoryName, to: `/catalog?category=${product.categoryId}` }]
                        : []),
                    { label: product.title },
                ]}
            />

            <Button
                component={Link}
                to="/catalog"
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                sx={{ color: 'text.secondary', mb: 3, pl: 0 }}
            >
                Back to catalog
            </Button>

            <Grid container spacing={{ xs: 4, md: 8 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Reveal margin="-20px">
                        <ProductGallery
                            images={(product.images?.length ? product.images : [product.image])
                                .filter(Boolean)
                                .map((src) => resolveImageUrl(src))}
                            alt={product.title}
                            viewTransitionName={`product-image-${product.id}`}
                        />
                    </Reveal>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Reveal margin="-20px" delay={0.1}>
                        {product.categoryName && (
                            <Chip
                                label={product.categoryName}
                                sx={{ mb: 2, bgcolor: tagColorFor(product.categoryName), fontWeight: 600 }}
                            />
                        )}

                        <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '1.625rem', md: '2rem' } }}>
                            {product.title}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <RatingSummary average={product.avgRating} count={product.reviewCount} showEmpty />
                        </Box>

                        <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, maxWidth: 480 }}>
                            {product.description}
                        </Typography>

                        <PriceTag value={product.price} variant="h4" sx={{ mb: 2 }} />

                        <StockMeter stock={Number(product.stock) || 0} />

                        <PurchaseControls product={product} key={product.id} />

                        <Box sx={{ mt: 4 }}>
                            <ProductSpecs specs={product.specs} />
                        </Box>
                    </Reveal>
                </Grid>
            </Grid>

            <Box sx={{ maxWidth: 720, mt: { xs: 6, md: 8 } }}>
                <ProductReviews productId={product.id} key={product.id} />
            </Box>

            <Box sx={{ mt: { xs: 6, md: 8 } }}>
                <RelatedProducts categoryId={product.categoryId} excludeId={product.id} />
            </Box>
        </>
    );
};

export default ProductDetails;
