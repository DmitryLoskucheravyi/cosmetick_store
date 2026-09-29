import { Box, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const QuantityStepper = ({ value, onDecrease, onIncrease, min = 1, max, size = 32 }) => (
    <Box
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            border: '1.5px solid',
            borderColor: 'divider',
            borderRadius: 999,
            p: 0.5,
        }}
    >
        <IconButton
            size="small"
            onClick={onDecrease}
            disabled={value <= min}
            sx={{ width: size, height: size }}
            aria-label="Decrease quantity"
        >
            <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>
            {value}
        </Typography>

        <IconButton
            size="small"
            onClick={onIncrease}
            disabled={max != null && value >= max}
            sx={{ width: size, height: size }}
            aria-label="Increase quantity"
        >
            <AddIcon fontSize="small" />
        </IconButton>
    </Box>
);

export default QuantityStepper;
