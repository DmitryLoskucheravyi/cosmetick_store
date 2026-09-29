import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart, updateQuantity } from '../redux/cart/cartSlice';

// Single place that knows the rules for adding a product to the cart:
// require a session, then optionally bump quantity past the default of one.
// Used by both the catalog card and the product page so the guard and
// feedback can't drift between them again.
export const useAddToCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    return async (productId, quantity = 1) => {
        if (!user) {
            toast.info('Log in to add items to your cart');
            navigate('/login');
            return;
        }

        try {
            await dispatch(addToCart(productId)).unwrap();

            if (quantity > 1) {
                await dispatch(updateQuantity({ productId, quantity })).unwrap();
            }

            toast.success('Added to cart');
        } catch {
            toast.error('Could not add this to your cart');
        }
    };
};
