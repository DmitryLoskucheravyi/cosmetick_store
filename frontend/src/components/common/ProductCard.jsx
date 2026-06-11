import {
    Card,
    CardMedia,
    Typography,
    Box,
    Button,
    Chip,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cart/cartSlice';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <Card
            onClick={() =>
                navigate(`/products/${product.id}`)
            }
            sx={{
                cursor: 'pointer',
                borderRadius: 4,
                boxShadow: 'none',
                border: '1px solid #eee',
                overflow: 'hidden',
                transition: '.25s',

                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow:
                        '0 12px 30px rgba(0,0,0,.08)',
                },
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    image={
                        product.image
                            ? `http://localhost:5000${product.image}`
                            : 'https://placehold.co/500x500'
                    }
                    alt={product.title}
                    sx={{
                        height: 220,
                        objectFit: 'cover',
                    }}
                />

                <Chip
                    label={product.categoryName}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        bgcolor: 'white',
                    }}
                />
            </Box>

            <Box sx={{ p: 2 }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {product.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        height: 40,
                        overflow: 'hidden',
                        mb: 2,
                    }}
                >
                    {product.description}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        ${product.price}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                            <AddShoppingCartIcon />
                        }
                        onClick={(e) => {
                            e.stopPropagation()
                            dispatch(
                                addToCart(product.id)
                            )
                        }

                        }
                    >
                        Add
                    </Button>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    component={Link}
                    to={`/products/${product.id}`}
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                    }}
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    View Product
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;