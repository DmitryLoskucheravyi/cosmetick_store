import {
    useEffect,
    useRef,
    useCallback,
    useState,
} from 'react';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import { useSearchParams } from 'react-router-dom';

import {
    Typography,
    CircularProgress,
    Box,
    Paper,
    TextField,
    InputAdornment,
    MenuItem,
    Stack,
    Button,
    IconButton,
    Tooltip,
    Slider,
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';
import Collapse from '@mui/material/Collapse';

import Grid from '@mui/material/Grid';

import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import ProductCard from '../components/common/ProductCard';
import EmptyState from '../components/common/EmptyState';
import Breadcrumbs from '../components/common/Breadcrumbs';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import { colors } from '../theme/theme';
import { motion } from 'framer-motion';
import Reveal from '../motion/Reveal';
import TiltCard from '../motion/TiltCard';
import { EASE } from '../motion/variants';

import {
    getProducts,
    resetProducts,
    getPriceRange,
} from '../redux/product/productSlice';

import {
    getCategories,
} from '../redux/category/categorySlice';

const DEFAULT_SORT = 'newest';
const DEBOUNCE_MS = 300;

const Catalog = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const stock = searchParams.get('stock') || '';
    const sort = searchParams.get('sort') || DEFAULT_SORT;
    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');

    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(search);
    const [prevSearch, setPrevSearch] = useState(search);

    const pageRef = useRef(1);
    const observer = useRef();

    const {
        products,
        loading,
        loadingMore,
        hasMore,
        pagination,
        priceRange,
    } = useSelector(state => state.products);

    const { categories } = useSelector(state => state.categories);

    const bounds = priceRange || { min: 0, max: 5000 };
    const priceMin = priceMinParam !== null ? Number(priceMinParam) : bounds.min;
    const priceMax = priceMaxParam !== null ? Number(priceMaxParam) : bounds.max;

    const [priceValue, setPriceValue] = useState([priceMin, priceMax]);
    const [prevBoundsKey, setPrevBoundsKey] = useState(`${priceMin}-${priceMax}`);

    // Keep the search box and slider in sync when the URL changes from
    // outside typing/dragging (back/forward nav, a reset, the header
    // search). Adjusting state during render — rather than in an effect —
    // avoids an extra commit/flash of the stale value.
    if (search !== prevSearch) {
        setPrevSearch(search);
        setSearchInput(search);
    }

    const boundsKey = `${priceMin}-${priceMax}`;
    if (boundsKey !== prevBoundsKey) {
        setPrevBoundsKey(boundsKey);
        setPriceValue([priceMin, priceMax]);
    }

    // Merges a patch of params into the URL — the single source of truth
    // for every filter, so a copied link always reproduces this exact view.
    const updateParams = useCallback((patch) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            Object.entries(patch).forEach(([key, value]) => {
                if (value === '' || value === null || value === undefined) {
                    next.delete(key);
                } else {
                    next.set(key, value);
                }
            });

            return next;
        });
    }, [setSearchParams]);

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getPriceRange());
    }, [dispatch]);

    // Debounce typing into the search box before it hits the URL/backend.
    useEffect(() => {
        const handle = setTimeout(() => {
            if (searchInput !== search) {
                updateParams({ search: searchInput });
            }
        }, DEBOUNCE_MS);

        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    // Debounce dragging the slider before it hits the URL/backend.
    useEffect(() => {
        const handle = setTimeout(() => {
            if (priceValue[0] !== priceMin || priceValue[1] !== priceMax) {
                updateParams({ priceMin: priceValue[0], priceMax: priceValue[1] });
            }
        }, DEBOUNCE_MS);

        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceValue]);

    const fetchProducts = useCallback((pageNumber) => {
        dispatch(getProducts({
            page: pageNumber,
            limit: 12,
            search,
            category,
            stock,
            sort,
            minPrice: priceMinParam ?? '',
            maxPrice: priceMaxParam ?? '',
        }));
    }, [dispatch, search, category, stock, sort, priceMinParam, priceMaxParam]);

    // Any real filter change resets the list back to page 1 and refetches —
    // this is what makes a shared/reloaded URL show the same products.
    // `fetchProducts` itself only changes identity when a filter does, so
    // this effect re-fires exactly on filter changes, not on page bumps.
    useEffect(() => {
        pageRef.current = 1;
        dispatch(resetProducts());
        fetchProducts(1);
    }, [dispatch, fetchProducts]);

    const resetFilters = () => {
        setSearchInput('');
        setSearchParams({});
    };

    const activeFilters =
        Number(!!search) +
        Number(!!category) +
        Number(!!stock) +
        Number(sort !== DEFAULT_SORT) +
        Number(priceMinParam !== null || priceMaxParam !== null);

    const selectedCategory = categories.find(
        (c) => String(c.id) === String(category)
    );

    const lastProductRef = useCallback(
        node => {
            if (loadingMore) return;

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    pageRef.current += 1;
                    fetchProducts(pageRef.current);
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [loadingMore, hasMore, fetchProducts]
    );

    if (loading && products.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Breadcrumbs
                items={[
                    { label: 'Home', to: '/' },
                    ...(selectedCategory
                        ? [{ label: 'Catalog', to: '/catalog' }, { label: selectedCategory.name }]
                        : [{ label: 'Catalog' }]),
                ]}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 1,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Catalog
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={
                        <motion.span
                            animate={{ rotate: showFilters ? 180 : 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            style={{ display: 'flex' }}
                        >
                            <FilterListIcon />
                        </motion.span>
                    }
                    onClick={() => setShowFilters(prev => !prev)}
                >
                    Filters
                    {activeFilters > 0 && ` (${activeFilters})`}
                </Button>
            </Box>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                {pagination?.total ?? 0} {pagination?.total === 1 ? 'product' : 'products'} found
            </Typography>

            <Collapse in={showFilters}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        mb: 3,
                        borderRadius: '16px',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                        >
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                value={category}
                                onChange={e => updateParams({ category: e.target.value })}
                            >
                                <MenuItem value="">All Categories</MenuItem>

                                {categories.map(cat => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                fullWidth
                                label="Stock"
                                value={stock}
                                onChange={e => updateParams({ stock: e.target.value })}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="in-stock">In Stock</MenuItem>
                                <MenuItem value="out-of-stock">Out Of Stock</MenuItem>
                            </TextField>

                            <TextField
                                select
                                fullWidth
                                label="Sort"
                                value={sort}
                                onChange={e => updateParams({ sort: e.target.value })}
                            >
                                <MenuItem value="newest">Newest</MenuItem>
                                <MenuItem value="price-asc">Price ↑</MenuItem>
                                <MenuItem value="price-desc">Price ↓</MenuItem>
                                <MenuItem value="name-asc">Name A-Z</MenuItem>
                                <MenuItem value="name-desc">Name Z-A</MenuItem>
                            </TextField>

                            <Tooltip title="Reset filters">
                                <IconButton
                                    onClick={resetFilters}
                                    aria-label="Reset filters"
                                    sx={{
                                        flexShrink: 0,
                                        border: '1.5px solid',
                                        borderColor: 'divider',
                                        borderRadius: '10px',
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    <RestartAltIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        <Box sx={{ px: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Price: {priceValue[0]} – {priceValue[1]} UAH
                            </Typography>

                            <Slider
                                value={priceValue}
                                onChange={(e, newValue) => setPriceValue(newValue)}
                                min={bounds.min}
                                max={bounds.max}
                                disabled={bounds.min === bounds.max}
                                valueLabelDisplay="auto"
                                sx={{ maxWidth: 480 }}
                            />
                        </Box>
                    </Stack>
                </Paper>
            </Collapse>

            <Grid container spacing={3}>
                {products.map((product, index) => {
                    const isLast = index === products.length - 1;

                    return (
                        <Grid
                            ref={isLast ? lastProductRef : null}
                            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                            key={product.id}
                        >
                            <Reveal margin="-40px">
                                <TiltCard>
                                    <ProductCard product={product} />
                                </TiltCard>
                            </Reveal>
                        </Grid>
                    );
                })}
            </Grid>

            {products.length === 0 && !loading && (
                <EmptyState
                    icon={<SearchOffOutlinedIcon fontSize="inherit" />}
                    color={colors.grapeSoft}
                    title="Nothing matches those filters"
                    description="Try a broader search or clear a filter to see more products."
                    actionLabel="Reset filters"
                    onAction={resetFilters}
                />
            )}

            {loadingMore && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}
        </>
    );
};

export default Catalog;
