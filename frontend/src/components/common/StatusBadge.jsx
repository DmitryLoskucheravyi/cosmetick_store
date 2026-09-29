import { Chip } from '@mui/material';

const STATUS_COLOR = {
    pending: 'warning',
    processing: 'secondary',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'error',
};

const STATUS_LABEL = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

// Single source of truth for order-status color/label, previously
// duplicated between the customer orders page and the admin orders table.
const StatusBadge = ({ status, size = 'small', sx }) => (
    <Chip
        label={STATUS_LABEL[status] || status}
        color={STATUS_COLOR[status] || 'default'}
        size={size}
        sx={sx}
    />
);

export default StatusBadge;
