import { useEffect, useState } from 'react';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../../redux/category/categorySlice';

import {
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

const Categories = () => {

    const dispatch = useDispatch();

    const { categories } = useSelector(
        state => state.categories
    );

    const [openCreate, setOpenCreate] =
        useState(false);

    const [openEdit, setOpenEdit] =
        useState(false);

    const [name, setName] =
        useState('');

    const [selectedCategory,
        setSelectedCategory] =
        useState(null);

    useEffect(() => {

        dispatch(
            getCategories()
        );

    }, [dispatch]);

    const handleCreate = async () => {

        if (!name.trim()) return;

        await dispatch(
            createCategory(name)
        );

        setName('');
        setOpenCreate(false);
    };

    const handleEdit = async () => {

        if (!selectedCategory) return;

        await dispatch(
            updateCategory({
                id: selectedCategory.id,
                name,
            })
        );

        setOpenEdit(false);
        setName('');
    };

    const handleDelete = (id) => {

        if (
            !window.confirm(
                'Delete category?'
            )
        ) {
            return;
        }

        dispatch(
            deleteCategory(id)
        );
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Categories
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        setOpenCreate(true)
                    }
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                    }}
                >
                    Add Category
                </Button>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    border: '1px solid #eee',
                    borderRadius: 4,
                    overflow: 'hidden',
                }}
            >
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Category
                            </TableCell>

                            <TableCell
                                align="right"
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {
                            categories.map(
                                category => (
                                    <TableRow
                                        key={
                                            category.id
                                        }
                                        hover
                                    >
                                        <TableCell>

                                            <Chip
                                                icon={
                                                    <CategoryOutlinedIcon />
                                                }
                                                label={
                                                    category.name
                                                }
                                                sx={{
                                                    borderRadius: 2,
                                                }}
                                            />

                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >
                                            <IconButton
                                                onClick={() => {

                                                    setSelectedCategory(
                                                        category
                                                    );

                                                    setName(
                                                        category.name
                                                    );

                                                    setOpenEdit(
                                                        true
                                                    );
                                                }}
                                            >
                                                <EditOutlinedIcon />
                                            </IconButton>

                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(
                                                        category.id
                                                    )
                                                }
                                            >
                                               <DeleteOutlinedIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        }

                    </TableBody>

                </Table>
            </Paper>

            <Dialog
                open={openCreate}
                onClose={() =>
                    setOpenCreate(false)
                }
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Create Category
                </DialogTitle>

                <DialogContent>

                    <TextField
                        autoFocus
                        fullWidth
                        label="Category Name"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        sx={{
                            mt: 1,
                        }}
                    />

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenCreate(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleCreate}
                    >
                        Create
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog
                open={openEdit}
                onClose={() =>
                    setOpenEdit(false)
                }
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Edit Category
                </DialogTitle>

                <DialogContent>

                    <TextField
                        autoFocus
                        fullWidth
                        label="Category Name"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        sx={{
                            mt: 1,
                        }}
                    />

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={() =>
                            setOpenEdit(false)
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleEdit}
                    >
                        Save
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    );
};

export default Categories;