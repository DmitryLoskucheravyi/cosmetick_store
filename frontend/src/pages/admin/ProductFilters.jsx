import {
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    Box,
    Typography,
    InputAdornment,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

const ProductFilters = ({
    filters,
    setFilters,
    categories,
    setAppliedFilters,
}) => {

    const handleChange = (e) => {

        setFilters(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
            page: 1,
        }));
    };

    const resetFilters = () => {

        const defaultFilters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            stock: '',
            sort: 'newest',
            page: 1,
            limit: 10,
        };

        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                mb: 4,
                borderRadius: 5,
                border: '1px solid #ececec',
                boxShadow:
                    '0 4px 20px rgba(0,0,0,.03)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3,
                }}
            >
                <FilterAltOutlinedIcon />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    Product Filters
                </Typography>
            </Box>

            <Grid
                container
                spacing={2}
            >
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth
                        label="Search Product"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                        select
                        fullWidth
                        label="Category"
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CategoryOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem value="">
                            All Categories
                        </MenuItem>

                        {categories.map(category => (
                            <MenuItem
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid size={{ xs: 6, md: 2 }}>
                    <TextField
                        fullWidth
                        label="Min Price"
                        name="minPrice"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 6, md: 2 }}>
                    <TextField
                        fullWidth
                        label="Max Price"
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                        select
                        fullWidth
                        label="Stock"
                        name="stock"
                        value={filters.stock}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Inventory2OutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                    >
                        <MenuItem value="">
                            All
                        </MenuItem>

                        <MenuItem value="in-stock">
                            In Stock
                        </MenuItem>

                        <MenuItem value="low-stock">
                            Low Stock
                        </MenuItem>

                        <MenuItem value="out-of-stock">
                            Out Of Stock
                        </MenuItem>
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                        select
                        fullWidth
                        label="Sort"
                        name="sort"
                        value={filters.sort}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SortOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
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
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={
                                <FilterAltOutlinedIcon />
                            }
                            onClick={() =>
                                setAppliedFilters(filters)
                            }
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Apply Filters
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={resetFilters}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                textTransform: 'none',
                            }}
                        >
                            Reset
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ProductFilters;