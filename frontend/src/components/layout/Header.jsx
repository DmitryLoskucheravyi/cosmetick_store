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
} from '@mui/material';

import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';

import {
    Link,
    useNavigate,
} from 'react-router-dom';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    logout,
} from '../../redux/auth/authSlice';

import {
    useState,
} from 'react';

const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const { user } = useSelector(
        state => state.auth
    );

    const { items = [] } = useSelector(
        state => state.cart
    );

    const cartCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'white',
                    color: 'black',
                    borderBottom: '1px solid #eee',
                }}
            >
                <Toolbar>

                    <Typography
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 700,
                            fontSize: '1.3rem',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        pomu/
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <IconButton
                            component={Link}
                            to="/catalog"
                        >
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                }}
                            >
                                Catalog
                            </Typography>
                        </IconButton>

                        <IconButton
                            component={Link}
                            to="/cart"
                        >
                            <Badge
                                badgeContent={cartCount}
                                color="primary"
                            >
                                <ShoppingBagOutlinedIcon />
                            </Badge>
                        </IconButton>

                        {
                            user && (
                                <IconButton
                                    component={Link}
                                    to="/profile"
                                >
                                    <PersonIcon />
                                </IconButton>
                            )
                        }

                        <IconButton
                            onClick={() =>
                                setOpen(true)
                            }
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={open}
                onClose={() =>
                    setOpen(false)
                }
            >
                <Box
                    sx={{
                        width: 280,
                        pt: 2,
                    }}
                >
                    <List>

                        {
                            !user && (
                                <ListItemButton
                                    component={Link}
                                    to="/login"
                                >
                                    <ListItemText
                                        primary="Login"
                                    />
                                </ListItemButton>
                            )
                        }

                        {
                            user && (
                                <>
                                    <ListItemButton
                                        component={Link}
                                        to="/orders"
                                    >
                                        <ListItemText
                                            primary="Orders"
                                        />
                                    </ListItemButton>

                                    {
                                        user.role === 'admin' && (
                                            <ListItemButton
                                                component={Link}
                                                to="/admin"
                                            >
                                                <ListItemText
                                                    primary="Admin Panel"
                                                />
                                            </ListItemButton>
                                        )
                                    }

                                    <ListItemButton
                                        onClick={() => {

                                            dispatch(
                                                logout()
                                            );

                                            navigate(
                                                '/login'
                                            );
                                        }}
                                    >
                                        <ListItemText
                                            primary="Logout"
                                        />
                                    </ListItemButton>
                                </>
                            )
                        }

                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default Header;