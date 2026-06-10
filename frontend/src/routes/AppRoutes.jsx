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
            </Routes>
        </Layout>
    );
};

export default AppRoutes;