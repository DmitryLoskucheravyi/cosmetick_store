import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

import Layout from '../components/layout/Layout';

const Home = lazy(() => import('../pages/Home'));
const Catalog = lazy(() => import('../pages/Catalog'));
const Cart = lazy(() => import('../pages/Cart'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Profile = lazy(() => import('../pages/Profile'));
const UserOrders = lazy(() => import('../pages/UserOrders'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
const AdminRoute = lazy(() => import('../pages/AdminRoute'));
const CreateProduct = lazy(() => import('../pages/admin/CreateProduct'));
const Orders = lazy(() => import('../pages/admin/Orders'));
const EditProduct = lazy(() => import('../pages/admin/EditProduct'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const Categories = lazy(() => import('../pages/admin/Categories'));
const Products = lazy(() => import('../pages/admin/Products'));




const AppRoutes = () => {
    return (
        <Layout>
            <Suspense
                fallback={
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
                }
            >
                <Routes>
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
                        path="/products/:id"
                        element={<ProductDetails />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/register"
                        element={<Register />}
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
                </Routes>
            </Suspense>
        </Layout>
    );
};

export default AppRoutes;