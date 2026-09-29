import { useEffect, useRef, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Box,
    Container,
    InputBase,
    CircularProgress,
} from '@mui/material';

import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence, useAnimationControls, useReducedMotion } from 'framer-motion';

import api from '../../api/axios';
import { logout } from '../../redux/auth/authSlice';
import { colors } from '../../theme/theme';
import { EASE } from '../../motion/variants';
import { resolveImageUrl } from '../../utils/imageUrl';
import PriceTag from '../common/PriceTag';

const NAV_LINKS = [{ label: 'Catalog', to: '/catalog' }];
const SEARCH_DEBOUNCE_MS = 300;

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchInputRef = useRef(null);
    const searchSeq = useRef(0);
    const reduced = useReducedMotion();

    const { user } = useSelector((state) => state.auth);
    const { items = [] } = useSelector((state) => state.cart);
    const wishlistCount = useSelector((state) => state.wishlist.items.length);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        if (searchOpen) {
            searchInputRef.current?.focus();
        }
    }, [searchOpen]);

    // Live product suggestions as you type, debounced so every keystroke
    // doesn't fire a request; `searchSeq` drops stale responses that land
    // out of order.
    useEffect(() => {
        const term = searchValue.trim();
        const seq = ++searchSeq.current;

        if (!term) {
            queueMicrotask(() => {
                if (seq === searchSeq.current) {
                    setSearchResults([]);
                    setSearchLoading(false);
                }
            });
            return;
        }

        queueMicrotask(() => {
            if (seq === searchSeq.current) {
                setSearchLoading(true);
            }
        });

        const handle = setTimeout(() => {
            api.get('/products', { params: { search: term, limit: 6 } })
                .then((response) => {
                    if (seq === searchSeq.current) {
                        setSearchResults(response.data.data.products);
                    }
                })
                .catch(() => {
                    if (seq === searchSeq.current) {
                        setSearchResults([]);
                    }
                })
                .finally(() => {
                    if (seq === searchSeq.current) {
                        setSearchLoading(false);
                    }
                });
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(handle);
    }, [searchValue]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const term = searchValue.trim();
        setSearchOpen(false);
        navigate(term ? `/catalog?search=${encodeURIComponent(term)}` : '/catalog');
    };

    // Inline "ghost" completion of the top match — shown in muted gray past
    // the caret, never written into the field itself, so it can't clobber
    // what the person is actually typing.
    const topMatch = searchResults[0];
    const ghostSuffix =
        searchValue && topMatch && topMatch.title.toLowerCase().startsWith(searchValue.toLowerCase())
            ? topMatch.title.slice(searchValue.length)
            : '';

    // Cart icon "pings" (scale/wiggle + expanding ring) whenever the count
    // goes up — a concrete, meaningful confirmation instead of decoration.
    const bagControls = useAnimationControls();
    const [ping, setPing] = useState(false);
    const prevCount = useRef(cartCount);

    useEffect(() => {
        if (cartCount > prevCount.current && !reduced) {
            bagControls.start({
                scale: [1, 1.25, 0.95, 1],
                rotate: [0, -8, 6, 0],
                transition: { duration: 0.5, ease: 'easeOut' },
            });
            setPing(true);
            const timeout = setTimeout(() => setPing(false), 700);
            prevCount.current = cartCount;
            return () => clearTimeout(timeout);
        }
        prevCount.current = cartCount;
    }, [cartCount, reduced, bagControls]);

    return (
        <>
            <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Container maxWidth="lg" disableGutters>
                    <Toolbar sx={{ py: 1 }}>
                        <Typography
                            component={Link}
                            to="/"
                            sx={{
                                flexGrow: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                fontFamily: '"Bricolage Grotesque", sans-serif',
                                fontWeight: 700,
                                fontSize: '1.4rem',
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            pomu
                            <Box
                                component="span"
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: colors.punch,
                                    display: 'inline-block',
                                }}
                            />
                        </Typography>

                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1, mr: 1 }}>
                            {NAV_LINKS.map((link) => (
                                <Typography
                                    key={link.to}
                                    component={Link}
                                    to={link.to}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        borderRadius: 999,
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        textDecoration: 'none',
                                        '&:hover': { bgcolor: colors.canvas },
                                    }}
                                >
                                    {link.label}
                                </Typography>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconButton onClick={() => setSearchOpen(true)} aria-label="Search">
                                <SearchIcon />
                            </IconButton>

                            <IconButton component={Link} to="/wishlist" aria-label="Wishlist">
                                <Badge badgeContent={wishlistCount} color="primary">
                                    <FavoriteBorderIcon />
                                </Badge>
                            </IconButton>

                            <IconButton component={Link} to="/cart" aria-label="Cart" sx={{ position: 'relative' }}>
                                {ping && (
                                    <motion.span
                                        initial={{ scale: 0.6, opacity: 0.7 }}
                                        animate={{ scale: 1.9, opacity: 0 }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                        style={{
                                            position: 'absolute',
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            border: `2px solid ${colors.punch}`,
                                        }}
                                    />
                                )}
                                <motion.div animate={bagControls} style={{ display: 'flex' }}>
                                    <Badge badgeContent={cartCount} color="primary">
                                        <ShoppingBagOutlinedIcon />
                                    </Badge>
                                </motion.div>
                            </IconButton>

                            {user && (
                                <IconButton component={Link} to="/profile" aria-label="Profile">
                                    <PersonOutlineIcon />
                                </IconButton>
                            )}

                            <IconButton onClick={() => setOpen((o) => !o)} aria-label="Menu">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={open ? 'close' : 'menu'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: EASE }}
                                        style={{ display: 'flex' }}
                                    >
                                        {open ? <CloseIcon /> : <MenuIcon />}
                                    </motion.span>
                                </AnimatePresence>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 1300,
                            background: 'rgba(43,22,32,0.4)',
                        }}
                        onClick={() => setSearchOpen(false)}
                    >
                        <Box
                            component={motion.div}
                            initial={{ y: -16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -16, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                                position: 'absolute',
                                top: { xs: 0, sm: 16 },
                                left: { xs: 0, sm: '50%' },
                                transform: { xs: 'none', sm: 'translateX(-50%)' },
                                width: { xs: '100%', sm: 480 },
                                height: { xs: '100%', sm: 'auto' },
                                bgcolor: 'background.paper',
                                borderRadius: { xs: 0, sm: '16px' },
                                boxShadow: '0 20px 40px rgba(28,21,18,.18)',
                                p: 2,
                            }}
                        >
                            <Box
                                component="form"
                                onSubmit={handleSearchSubmit}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    border: '1.5px solid',
                                    borderColor: 'divider',
                                    borderRadius: 999,
                                    px: 2,
                                    py: 0.5,
                                }}
                            >
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                                <Box sx={{ position: 'relative', flexGrow: 1, minWidth: 0 }}>
                                    {ghostSuffix && (
                                        <Typography
                                            aria-hidden
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                whiteSpace: 'pre',
                                                overflow: 'hidden',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            <span style={{ visibility: 'hidden' }}>{searchValue}</span>
                                            <span style={{ color: colors.muted }}>{ghostSuffix}</span>
                                        </Typography>
                                    )}
                                    <InputBase
                                        inputRef={searchInputRef}
                                        fullWidth
                                        placeholder="Search products…"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        sx={{ position: 'relative' }}
                                    />
                                </Box>
                                <IconButton
                                    size="small"
                                    aria-label="Close search"
                                    onClick={() => setSearchOpen(false)}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            {searchValue.trim() && (
                                <Box sx={{ mt: 1.5 }}>
                                    {searchLoading && searchResults.length === 0 ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                            <CircularProgress size={22} />
                                        </Box>
                                    ) : searchResults.length > 0 ? (
                                        <>
                                            <List disablePadding sx={{ maxHeight: 320, overflowY: 'auto' }}>
                                                {searchResults.map((product) => (
                                                    <ListItemButton
                                                        key={product.id}
                                                        component={Link}
                                                        to={`/products/${product.id}`}
                                                        onClick={() => setSearchOpen(false)}
                                                        sx={{ borderRadius: '10px', gap: 1.5, alignItems: 'center' }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={resolveImageUrl(product.image, 'https://placehold.co/80x80')}
                                                            alt=""
                                                            sx={{
                                                                width: 40,
                                                                height: 40,
                                                                objectFit: 'contain',
                                                                borderRadius: '8px',
                                                                bgcolor: colors.canvas,
                                                                flexShrink: 0,
                                                            }}
                                                        />
                                                        <ListItemText
                                                            primary={product.title}
                                                            slotProps={{ primary: { noWrap: true, sx: { fontWeight: 600 } } }}
                                                        />
                                                        <PriceTag value={product.price} variant="body2" />
                                                    </ListItemButton>
                                                ))}
                                            </List>

                                            <Typography
                                                component={Link}
                                                to={`/catalog?search=${encodeURIComponent(searchValue.trim())}`}
                                                onClick={() => setSearchOpen(false)}
                                                sx={{
                                                    display: 'block',
                                                    textAlign: 'center',
                                                    mt: 0.5,
                                                    py: 1,
                                                    borderRadius: '10px',
                                                    fontWeight: 600,
                                                    color: 'primary.main',
                                                    textDecoration: 'none',
                                                    '&:hover': { bgcolor: colors.canvas },
                                                }}
                                            >
                                                See all results for &ldquo;{searchValue.trim()}&rdquo;
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                            No products found
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 280, pt: 2 }}>
                    <List>
                        <ListItemButton component={Link} to="/catalog" onClick={() => setOpen(false)}>
                            <ListItemText primary="Catalog" />
                        </ListItemButton>

                        <ListItemButton component={Link} to="/wishlist" onClick={() => setOpen(false)}>
                            <ListItemText primary="Wishlist" />
                        </ListItemButton>

                        {!user && (
                            <ListItemButton component={Link} to="/login" onClick={() => setOpen(false)}>
                                <ListItemText primary="Log in" />
                            </ListItemButton>
                        )}

                        {user && (
                            <>
                                <ListItemButton component={Link} to="/orders" onClick={() => setOpen(false)}>
                                    <ListItemText primary="My orders" />
                                </ListItemButton>

                                {user.role === 'admin' && (
                                    <ListItemButton component={Link} to="/admin" onClick={() => setOpen(false)}>
                                        <ListItemText primary="Admin panel" />
                                    </ListItemButton>
                                )}

                                <ListItemButton
                                    onClick={() => {
                                        dispatch(logout());
                                        setOpen(false);
                                        navigate('/login');
                                    }}
                                >
                                    <ListItemText primary="Log out" />
                                </ListItemButton>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Header;
