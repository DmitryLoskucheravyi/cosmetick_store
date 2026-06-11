import {
    useEffect,
    useRef,
    useCallback,
    useState,
    useMemo,
} from 'react';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

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
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';
import Collapse from '@mui/material/Collapse';

import Grid from '@mui/material/Grid';

import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import ProductCard from '../components/common/ProductCard';

import {
    getProducts,
    resetProducts,
} from '../redux/product/productSlice';

import {
    getCategories,
} from '../redux/category/categorySlice';

const Catalog = () => {

    const dispatch = useDispatch();

    const [page, setPage] =
        useState(1);

    const [search, setSearch] =
        useState('');

    const [category, setCategory] =
        useState('');

    const [showFilters, setShowFilters] =
        useState(false);

    const [stock, setStock] =
        useState('');

    const [sort, setSort] =
        useState('newest');

    const observer = useRef();

    const {
        products,
        loading,
        loadingMore,
        hasMore,
    } = useSelector(
        state => state.products
    );

    const {
        categories,
    } = useSelector(
        state => state.categories
    );

    useEffect(() => {

        dispatch(resetProducts());

        dispatch(
            getProducts({
                page: 1,
                limit: 12,
            })
        );

        dispatch(
            getCategories()
        );

    }, [dispatch]);

    useEffect(() => {

        if (page === 1)
            return;

        dispatch(
            getProducts({
                page,
                limit: 12,
            })
        );

    }, [page, dispatch]);

    const filteredProducts =
        useMemo(() => {

            let result = [
                ...products,
            ];

            if (search) {

                result =
                    result.filter(
                        product =>
                            product.title
                                .toLowerCase()
                                .includes(
                                    search.toLowerCase()
                                )
                    );
            }

            if (category) {

                result =
                    result.filter(
                        product =>
                            String(
                                product.categoryId
                            ) ===
                            String(
                                category
                            )
                    );
            }

            if (
                stock ===
                'in-stock'
            ) {

                result =
                    result.filter(
                        product =>
                            product.stock >
                            0
                    );
            }

            if (
                stock ===
                'out-of-stock'
            ) {

                result =
                    result.filter(
                        product =>
                            product.stock <=
                            0
                    );
            }

            switch (sort) {

                case 'price-asc':

                    result.sort(
                        (a, b) =>
                            Number(
                                a.price
                            ) -
                            Number(
                                b.price
                            )
                    );

                    break;

                case 'price-desc':

                    result.sort(
                        (a, b) =>
                            Number(
                                b.price
                            ) -
                            Number(
                                a.price
                            )
                    );

                    break;

                case 'name-asc':

                    result.sort(
                        (a, b) =>
                            a.title.localeCompare(
                                b.title
                            )
                    );

                    break;

                case 'name-desc':

                    result.sort(
                        (a, b) =>
                            b.title.localeCompare(
                                a.title
                            )
                    );

                    break;

                default:
                    break;
            }

            return result;

        }, [
            products,
            search,
            category,
            stock,
            sort,
        ]);

    const activeFilters =
        Number(!!search) +
        Number(!!category) +
        Number(!!stock) +
        Number(sort !== 'newest');

    const lastProductRef =
        useCallback(
            node => {

                if (
                    loadingMore
                )
                    return;

                if (
                    observer.current
                ) {

                    observer.current.disconnect();
                }

                observer.current =
                    new IntersectionObserver(
                        entries => {

                            if (
                                entries[0]
                                    .isIntersecting &&
                                hasMore
                            ) {

                                setPage(
                                    prev =>
                                        prev +
                                        1
                                );
                            }
                        }
                    );

                if (node) {

                    observer.current.observe(
                        node
                    );
                }
            },
            [
                loadingMore,
                hasMore,
            ]
        );

    if (
        loading &&
        products.length === 0
    ) {

        return (
            <Box
                sx={{
                    display:
                        'flex',
                    justifyContent:
                        'center',
                    mt: 5,
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 700 }}
                >
                    Catalog
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() =>
                        setShowFilters(
                            prev => !prev
                        )
                    }
                >
                    Filters
                    {activeFilters > 0 &&
                        ` (${activeFilters})`}
                </Button>


            </Box>
            <Collapse in={showFilters}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 4,
                        border:
                            '1px solid #eee',
                    }}
                >
                    <Stack
                        spacing={2}
                    >
                        <TextField
                            fullWidth
                            placeholder="Search products..."
                            value={
                                search
                            }
                            onChange={e =>
                                setSearch(
                                    e.target
                                        .value
                                )
                            }
                            InputProps={{
                                startAdornment:
                                    (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                            }}
                        />

                        <Stack
                            direction={{
                                xs: 'column',
                                md: 'row',
                            }}
                            spacing={2}
                        >
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                value={
                                    category
                                }
                                onChange={e =>
                                    setCategory(
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <MenuItem value="">
                                    All Categories
                                </MenuItem>

                                {categories.map(
                                    category => (
                                        <MenuItem
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </MenuItem>
                                    )
                                )}
                            </TextField>

                            <TextField
                                select
                                fullWidth
                                label="Stock"
                                value={
                                    stock
                                }
                                onChange={e =>
                                    setStock(
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <MenuItem value="">
                                    All
                                </MenuItem>

                                <MenuItem value="in-stock">
                                    In Stock
                                </MenuItem>

                                <MenuItem value="out-of-stock">
                                    Out Of Stock
                                </MenuItem>
                            </TextField>

                            <TextField
                                select
                                fullWidth
                                label="Sort"
                                value={
                                    sort
                                }
                                onChange={e =>
                                    setSort(
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <MenuItem value="newest">
                                    Newest
                                </MenuItem>

                                <MenuItem value="price-asc">
                                    Price ↑
                                </MenuItem>

                                <MenuItem value="price-desc">
                                    Price ↓
                                </MenuItem>

                                <MenuItem value="name-asc">
                                    Name A-Z
                                </MenuItem>

                                <MenuItem value="name-desc">
                                    Name Z-A
                                </MenuItem>
                            </TextField>

                            <Button
                                variant="outlined"
                                startIcon={
                                    <RestartAltIcon />
                                }
                                onClick={() => {

                                    setSearch(
                                        ''
                                    );

                                    setCategory(
                                        ''
                                    );

                                    setStock(
                                        ''
                                    );

                                    setSort(
                                        'newest'
                                    );
                                }}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

            </Collapse>

            <Grid
                container
                spacing={3}
            >
                {filteredProducts.map(
                    (
                        product,
                        index
                    ) => {

                        const isLast =
                            index ===
                            filteredProducts.length -
                            1;

                        return (
                            <Grid
                                ref={
                                    isLast
                                        ? lastProductRef
                                        : null
                                }
                                size={{
                                    xs: 12,
                                    sm: 6,
                                    md: 4,
                                }}
                                key={
                                    product.id
                                }
                            >
                                <ProductCard
                                    product={
                                        product
                                    }
                                />
                            </Grid>
                        );
                    }
                )}
            </Grid>

            {filteredProducts.length ===
                0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            mt: 4,
                            p: 5,
                            textAlign:
                                'center',
                            borderRadius: 4,
                            border:
                                '1px solid #eee',
                        }}
                    >
                        <Typography color="text.secondary">
                            No products found
                        </Typography>
                    </Paper>
                )}

            {loadingMore && (
                <Box
                    sx={{
                        display:
                            'flex',
                        justifyContent:
                            'center',
                        py: 4,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </>
    );
};

export default Catalog;
