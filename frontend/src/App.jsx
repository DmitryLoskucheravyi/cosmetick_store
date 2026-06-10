import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import AppRoutes from './routes/AppRoutes';

import { loadUser } from './redux/auth/authSlice';
import { getCart } from './redux/cart/cartSlice';
function App() {

  const dispatch = useDispatch();

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
      dispatch(getCart());
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;