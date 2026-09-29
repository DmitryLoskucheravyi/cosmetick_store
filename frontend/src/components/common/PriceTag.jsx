import { Typography } from '@mui/material';

const format = (value) =>
    Number(value || 0).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

// One place that decides how a price renders, so "1200 UAH" vs "1200.00 UAH"
// vs "$1200" (a bug in the old product page) can't drift between pages again.
const PriceTag = ({ value, variant = 'h6', component = 'span', sx }) => (
    <Typography variant={variant} component={component} sx={{ fontWeight: 700, ...sx }}>
        {format(value)} UAH
    </Typography>
);

export default PriceTag;
