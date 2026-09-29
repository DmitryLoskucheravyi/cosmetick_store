import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// items: [{ label, to? }] — the last item (or any item without `to`) renders
// as plain text, everything else as a link. Used on Catalog and ProductDetails
// so the trail always looks and behaves the same way.
const Breadcrumbs = ({ items, sx }) => (
    <MuiBreadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 16 }} />}
        sx={{ mb: 3, ...sx }}
    >
        {items.map((item) =>
            item.to ? (
                <Typography
                    key={item.label}
                    component={Link}
                    to={item.to}
                    variant="body2"
                    sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'text.primary' } }}
                >
                    {item.label}
                </Typography>
            ) : (
                <Typography key={item.label} variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {item.label}
                </Typography>
            )
        )}
    </MuiBreadcrumbs>
);

export default Breadcrumbs;
