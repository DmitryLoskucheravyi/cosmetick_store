import { Routes, Route } from 'react-router-dom';

import Layout from '../components/layout/Layout';

import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import UserOrders from '../pages/UserOrders';

import ProtectedRoute from './ProtectedRoute';
import ProductDetails from '../pages/ProductDetails';

import AdminRoute from '../pages/AdminRoute';
import { CreateProduct } from '../pages/admin/CreateProduct';
import { Orders } from '../pages/admin/Orders';
import { EditProduct } from '../pages/admin/EditProduct';
import { Dashboard } from '../pages/admin/Dashboard';
import { Categories } from '../pages/admin/Categories';




const AppRoutes = () => {
    return (
        <Layout>
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
        </Layout>
    );
};

export default AppRoutes;