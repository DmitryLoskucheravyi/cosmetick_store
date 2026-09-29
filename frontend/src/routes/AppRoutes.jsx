import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

import Layout from '../components/layout/Layout';
import { useViewTransitionLocation } from '../hooks/useViewTransitionLocation';

const Home = lazy(() => import('../pages/Home'));
const Catalog = lazy(() => import('../pages/Catalog'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Profile = lazy(() => import('../pages/Profile'));
const UserOrders = lazy(() => import('../pages/UserOrders'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const Terms = lazy(() => import('../pages/Terms'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const AdminRoute = lazy(() => import('../pages/AdminRoute'));
const CreateProduct = lazy(() => import('../pages/admin/CreateProduct'));
const Orders = lazy(() => import('../pages/admin/Orders'));
const EditProduct = lazy(() => import('../pages/admin/EditProduct'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Categories = lazy(() => import('../pages/admin/Categories'));
const Products = lazy(() => import('../pages/admin/Products'));




const authRoutePaths = ['/login', '/register'];

const AppRoutes = () => {
    const location = useViewTransitionLocation();

    const suspenseFallback = (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CircularProgress />
        </Box>
    );

    // /login and /register are immersive full-page screens — no site
    // Header/Footer chrome around them.
    if (authRoutePaths.includes(location.pathname)) {
        return (
            <Suspense fallback={suspenseFallback}>
                <Routes location={location}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Suspense>
        );
    }

    return (
        <Layout>
            <Suspense fallback={suspenseFallback}>
                <Routes location={location}>
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/catalog"
                        element={<Catalog />}
                    />

                    <Route
                        path="/cart"
                        element={<Cart />}
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/order-success/:id"
                        element={
                            <ProtectedRoute>
                                <OrderSuccess />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />
                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <UserOrders />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <Dashboard />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products"
                        element={
                            <AdminRoute>
                                <Products />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products/create"
                        element={
                            <AdminRoute>
                                <CreateProduct />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/products/edit/:id"
                        element={
                            <AdminRoute>
                                <EditProduct />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/categories"
                        element={
                            <AdminRoute>
                                <Categories />
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <AdminRoute>
                                <Orders />
                            </AdminRoute>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </Layout>
    );
};

export default AppRoutes;