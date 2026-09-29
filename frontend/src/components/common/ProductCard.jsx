import { Card, CardActionArea, Typography, Box, Button, Chip, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PriceTag from './PriceTag';
import { colors } from '../../theme/theme';
import { tagColorFor } from '../../utils/tagColor';
import { useAddToCart } from '../../hooks/useAddToCart';
import { resolveImageUrl } from '../../utils/imageUrl';
import { toggleWishlist } from '../../redux/wishlist/wishlistSlice';
import RatingSummary from './RatingSummary';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const addToCart = useAddToCart();
    const outOfStock = Number(product.stock) <= 0;
    const isWishlisted = useSelector((state) =>
        state.wishlist.items.some((item) => item.id === product.id)
    );

    return (
        <Card
            variant="outlined"
            sx={{
                overflow: 'hidden',
                transition: 'transform .25s, box-shadow .25s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 32px rgba(28,21,18,.08)',
                },
            }}
        >
            <CardActionArea onClick={() => navigate(`/products/${product.id}`)}>
                <Box sx={{ position: 'relative', bgcolor: colors.canvas }}>
                    <Box
                        component="img"
                        src={resolveImageUrl(product.image, 'https://placehold.co/500x500')}
                        alt={product.title}
                        style={{ viewTransitionName: `product-image-${product.id}` }}
                        sx={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            objectFit: 'contain',
                            display: 'block',
                            p: '12px',
                        }}
                    />

                    {product.categoryName && (
                        <Chip
                            label={product.categoryName}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                bgcolor: tagColorFor(product.categoryName),
                                fontWeight: 600,
                            }}
                        />
                    )}

                    {outOfStock && (
                        <Chip
                            label="Sold out"
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                bgcolor: colors.ink,
                                color: '#fff',
                                fontWeight: 600,
                            }}
                        />
                    )}

                    <IconButton
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(toggleWishlist(product));
                        }}
                        sx={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            bgcolor: 'background.paper',
                            boxShadow: '0 4px 12px rgba(28,21,18,.12)',
                            '&:hover': { bgcolor: 'background.paper' },
                        }}
                    >
                        {isWishlisted ? (
                            <FavoriteIcon sx={{ color: colors.punch, fontSize: 20 }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                        )}
                    </IconButton>
                </Box>
            </CardActionArea>

            <Box sx={{ p: 2 }}>
                <Typography
                    component={Link}
                    to={`/products/${product.id}`}
                    sx={{
                        display: 'block',
                        fontWeight: 700,
                        mb: 0.5,
                        color: 'text.primary',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {product.title}
                </Typography>

                <Box sx={{ minHeight: 24, mb: 0.5 }}>
                    <RatingSummary average={product.avgRating} count={product.reviewCount} />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ height: 40, overflow: 'hidden', mb: 2 }}
                >
                    {product.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <PriceTag value={product.price} />

                    <Button
                        variant="contained"
                        size="small"
                        disabled={outOfStock}
                        startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id);
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default ProductCard;
