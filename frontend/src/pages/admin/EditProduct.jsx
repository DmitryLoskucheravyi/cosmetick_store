import { useState, useEffect } from 'react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem,
} from '@mui/material';

import {
    getCategories,
} from '../../redux/category/categorySlice';

import {
    getProductById,
} from '../../redux/product/productDetailsSlice';

import {
    updateProduct,
} from '../../redux/product/productSlice';

const EditProduct = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { categories } = useSelector(
        state => state.categories
    );

    const { product } = useSelector(
        state => state.productDetails
    );

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
    });

    const [image, setImage] = useState(null);

    useEffect(() => {

        dispatch(
            getCategories()
        );

        dispatch(
            getProductById(id)
        );

    }, [dispatch, id]);

    useEffect(() => {

        if (product) {

            setFormData({
                title: product.title || '',
                description:
                    product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                categoryId:
                    product.categoryId || '',
            });
        }

    }, [product]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const data = new FormData();

        data.append('id', id);
        data.append('title', formData.title);
        data.append(
            'description',
            formData.description
        );
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append(
            'categoryId',
            formData.categoryId
        );

        if (image) {

            data.append(
                'image',
                image
            );
        }

        try {

            await dispatch(
                updateProduct(data)
            ).unwrap();

            navigate(
                '/admin/products'
            );

        } catch (error) {

            console.error(error);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                maxWidth: 700,
                mx: 'auto',
                p: 4,
                border: '1px solid #eee',
                borderRadius: 4,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                }}
            >
                Edit Product
            </Typography>

            <Stack
                component="form"
                spacing={3}
                onSubmit={handleSubmit}
            >
                <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />

                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    select
                    label="Category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    fullWidth
                >
                    {categories.map(category => (
                        <MenuItem
                            key={category.id}
                            value={category.id}
                        >
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    component="label"
                    variant="outlined"
                >
                    Change Image

                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImage(
                                e.target.files[0]
                            )
                        }
                    />
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                >
                    Save Changes
                </Button>
            </Stack>
        </Paper>
    );
};

export default EditProduct;