import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Paper, Typography, TextField, Button, Stack, MenuItem, Box, CircularProgress } from '@mui/material';

import { getCategories } from '../../redux/category/categorySlice';
import { getProductById } from '../../redux/product/productDetailsSlice';
import { updateProduct } from '../../redux/product/productSlice';

// Keyed by product id in the parent, so its form state initializes fresh
// from the loaded product instead of being synced in after the fact.
const EditProductForm = ({ id, product, categories }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        categoryId: product.categoryId || '',
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('id', id);
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('categoryId', formData.categoryId);

        if (image) {
            data.append('image', image);
        }

        try {
            await dispatch(updateProduct(data)).unwrap();
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
            <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth />

            <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
            />

            <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth />

            <TextField label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} fullWidth />

            <TextField
                select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                fullWidth
            >
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ))}
            </TextField>

            <Button component="label" variant="outlined">
                Change image
                <input hidden type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </Button>

            <Button type="submit" variant="contained" size="large">
                Save changes
            </Button>
        </Stack>
    );
};

const EditProduct = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const { categories } = useSelector((state) => state.categories);
    const { product, loading } = useSelector((state) => state.productDetails);

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getProductById(id));
    }, [dispatch, id]);

    return (
        <Paper variant="outlined" sx={{ maxWidth: 700, mx: 'auto', p: 3, borderRadius: '16px' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                Edit product
            </Typography>

            {loading || !product ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <EditProductForm key={product.id} id={id} product={product} categories={categories} />
            )}
        </Paper>
    );
};

export default EditProduct;
