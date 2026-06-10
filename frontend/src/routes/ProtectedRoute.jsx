import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {

    const { user, loadingUser } = useSelector(
        state => state.auth
    );

    if (loadingUser) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;