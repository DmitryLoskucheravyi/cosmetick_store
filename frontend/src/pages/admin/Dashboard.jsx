import {
    Box,
    Typography,
    Paper,
    Grid,
} from '@mui/material';

import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

import { Link } from 'react-router-dom';

const Dashboard = () => {

    const cards = [
        {
            title: 'Products',
            description:
                'Manage products catalog',
            icon: <Inventory2OutlinedIcon />,
            link: '/admin/products',
        },
        {
            title: 'Categories',
            description:
                'Manage categories',
            icon: <CategoryOutlinedIcon />,
            link: '/admin/categories',
        },
        {
            title: 'Orders',
            description:
                'Manage customer orders',
            icon: <ReceiptLongOutlinedIcon />,
            link: '/admin/orders',
        },
    ];

    return (
        <>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 4,
                }}
            >
                Admin Dashboard
            </Typography>

            <Grid
                container
                spacing={3}
            >
                {cards.map(card => (

                    <Grid
                        key={card.title}
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <Paper
                            component={Link}
                            to={card.link}
                            elevation={0}
                            sx={{
                                p: 4,
                                border: '1px solid #eee',
                                borderRadius: 4,
                                textDecoration: 'none',
                                color: 'inherit',
                                display: 'block',
                                transition: '.25s',

                                '&:hover': {
                                    transform:
                                        'translateY(-4px)',
                                    boxShadow:
                                        '0 12px 30px rgba(0,0,0,.08)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    fontSize: 40,
                                    mb: 2,
                                }}
                            >
                                {card.icon}
                            </Box>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                }}
                            >
                                {card.title}
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                {card.description}
                            </Typography>

                        </Paper>
                    </Grid>

                ))}
            </Grid>
        </>
    );
};

export default Dashboard;