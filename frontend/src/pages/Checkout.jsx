import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
    Typography,
    Paper,
    Stack,
    Box,
    Button,
    Divider,
    TextField,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { createOrder, applyPromoCode, clearPromo } from '../redux/order/orderSlice';
import { getCart } from '../redux/cart/cartSlice';
import PriceTag from '../components/common/PriceTag';
import { resolveImageUrl } from '../utils/imageUrl';
import { colors } from '../theme/theme';

const FREE_SHIPPING_THRESHOLD = 1000;
const FLAT_SHIPPING_COST = 60;

const STEPS = ['Shipping address', 'Payment', 'Confirmation'];

const SHIPPING_METHODS = [
    { value: 'nova_poshta', label: 'Nova Poshta (branch)' },
    { value: 'ukrposhta', label: 'Ukrposhta (branch)' },
    { value: 'courier', label: 'Courier to address' },
];

const INITIAL_FORM = {
    shippingName: '',
    shippingPhone: '',
    shippingCity: '',
    shippingMethod: 'nova_poshta',
    shippingAddress: '',
    paymentMethod: 'cod',
};

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const items = useSelector((state) => state.cart.items || []);
    const promo = useSelector((state) => state.orders.promo);

    const [activeStep, setActiveStep] = useState(0);
    const [form, setForm] = useState(INITIAL_FORM);
    const [promoInput, setPromoInput] = useState('');
    const [placing, setPlacing] = useState(false);
    const [touched, setTouched] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + Number(item.total), 0);
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_COST;
    const discount = promo.discount || 0;
    const total = Math.max(0, subtotal + shippingCost - discount);

    if (!items.length) {
        return <Navigate to="/cart" replace />;
    }

    const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const isAddressValid =
        form.shippingName.trim() &&
        form.shippingPhone.trim() &&
        form.shippingCity.trim() &&
        form.shippingMethod &&
        form.shippingAddress.trim();

    const handleNext = () => {
        if (activeStep === 0 && !isAddressValid) {
            setTouched(true);
            return;
        }

        setTouched(false);
        setActiveStep((step) => Math.min(step + 1, STEPS.length - 1));
    };

    const handleBack = () => setActiveStep((step) => Math.max(step - 1, 0));

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;

        try {
            await dispatch(applyPromoCode({ code: promoInput.trim(), subtotal })).unwrap();
            toast.success('Promo code applied');
        } catch {
            // Error is already surfaced inline via promo.error.
        }
    };

    const handleRemovePromo = () => {
        dispatch(clearPromo());
        setPromoInput('');
    };

    const handlePlaceOrder = async () => {
        try {
            setPlacing(true);

            const result = await dispatch(
                createOrder({
                    ...form,
                    promoCode: promo.code || undefined,
                })
            ).unwrap();

            dispatch(clearPromo());
            dispatch(getCart());
            toast.success('Order placed');
            navigate(`/order-success/${result.orderId}`);
        } catch (error) {
            toast.error(error || 'Could not place the order');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                Checkout
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {STEPS.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '16px' }}>
                        {activeStep === 0 && (
                            <Stack spacing={2}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Where should we send it?
                                </Typography>

                                <TextField
                                    label="Full name"
                                    value={form.shippingName}
                                    onChange={setField('shippingName')}
                                    error={touched && !form.shippingName.trim()}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="Phone number"
                                    value={form.shippingPhone}
                                    onChange={setField('shippingPhone')}
                                    error={touched && !form.shippingPhone.trim()}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="City"
                                    value={form.shippingCity}
                                    onChange={setField('shippingCity')}
                                    error={touched && !form.shippingCity.trim()}
                                    required
                                    fullWidth
                                />

                                <TextField
                                    select
                                    label="Delivery method"
                                    value={form.shippingMethod}
                                    onChange={setField('shippingMethod')}
                                    fullWidth
                                >
                                    {SHIPPING_METHODS.map((method) => (
                                        <MenuItem key={method.value} value={method.value}>
                                            {method.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label={form.shippingMethod === 'courier' ? 'Street and house number' : 'Branch number / address'}
                                    value={form.shippingAddress}
                                    onChange={setField('shippingAddress')}
                                    error={touched && !form.shippingAddress.trim()}
                                    required
                                    fullWidth
                                />
                            </Stack>
                        )}

                        {activeStep === 1 && (
                            <Stack spacing={2}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    How would you like to pay?
                                </Typography>

                                <RadioGroup
                                    value={form.paymentMethod}
                                    onChange={setField('paymentMethod')}
                                >
                                    <FormControlLabel
                                        value="cod"
                                        control={<Radio />}
                                        label="Cash on delivery"
                                    />
                                    <FormControlLabel
                                        value="card"
                                        control={<Radio />}
                                        label="Pay online by card"
                                    />
                                </RadioGroup>
                            </Stack>
                        )}

                        {activeStep === 2 && (
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                                        Items
                                    </Typography>
                                    <Stack spacing={1.5}>
                                        {items.map((item) => (
                                            <Box
                                                key={item.productId}
                                                sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={resolveImageUrl(item.image, 'https://placehold.co/80x80')}
                                                    alt={item.title}
                                                    sx={{ width: 48, height: 48, objectFit: 'contain', borderRadius: '8px', bgcolor: colors.canvas, p: 0.5 }}
                                                />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Qty: {item.quantity}</Typography>
                                                </Box>
                                                <PriceTag value={item.total} variant="body2" />
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        Delivery to
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {form.shippingName} · {form.shippingPhone}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {form.shippingCity}, {SHIPPING_METHODS.find((m) => m.value === form.shippingMethod)?.label}
                                    </Typography>
                                    <Typography color="text.secondary">{form.shippingAddress}</Typography>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        Payment
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {form.paymentMethod === 'cod' ? 'Cash on delivery' : 'Card online'}
                                    </Typography>
                                </Box>
                            </Stack>
                        )}

                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
                            <Button onClick={handleBack} disabled={activeStep === 0 || placing}>
                                Back
                            </Button>

                            {activeStep < STEPS.length - 1 ? (
                                <Button variant="contained" onClick={handleNext}>
                                    Continue
                                </Button>
                            ) : (
                                <Button variant="contained" onClick={handlePlaceOrder} disabled={placing}>
                                    {placing ? 'Placing order…' : 'Place order'}
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '16px', position: 'sticky', top: 100 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                            Order summary
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={1} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Subtotal</Typography>
                                <PriceTag value={subtotal} variant="body1" />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography color="text.secondary">Shipping</Typography>
                                <Typography sx={{ fontWeight: 700 }}>
                                    {shippingCost === 0 ? 'Free' : `${shippingCost} UAH`}
                                </Typography>
                            </Box>

                            {discount > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ color: colors.mint }}>Discount ({promo.code})</Typography>
                                    <Typography sx={{ fontWeight: 700, color: colors.mint }}>
                                        −{discount} UAH
                                    </Typography>
                                </Box>
                            )}
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <TextField
                                size="small"
                                placeholder="Promo code"
                                fullWidth
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value)}
                                disabled={!!promo.code}
                                error={!!promo.error}
                                helperText={promo.error || ' '}
                            />

                            {promo.code ? (
                                <Button variant="outlined" color="error" onClick={handleRemovePromo}>
                                    Remove
                                </Button>
                            ) : (
                                <Button
                                    variant="outlined"
                                    onClick={handleApplyPromo}
                                    disabled={promo.applying || !promoInput.trim()}
                                >
                                    Apply
                                </Button>
                            )}
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                            <PriceTag value={total} variant="h6" />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default Checkout;
