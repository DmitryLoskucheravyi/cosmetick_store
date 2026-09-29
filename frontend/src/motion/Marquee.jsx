import { Box } from '@mui/material';

// Infinite horizontal scroll of `items`, content duplicated once for a
// seamless loop, paused on hover/focus via CSS (see .marquee in main.css).
const Marquee = ({ items, renderItem, speed = 26 }) => (
    <Box className="marquee" sx={{ overflow: 'hidden' }}>
        <Box className="marquee-track" sx={{ animationDuration: `${speed}s` }}>
            {[0, 1].map((copy) => (
                <Box key={copy} sx={{ display: 'flex', flexShrink: 0 }}>
                    {items.map((item, i) => (
                        <Box key={`${copy}-${i}`} sx={{ display: 'flex', alignItems: 'center' }}>
                            {renderItem(item)}
                        </Box>
                    ))}
                </Box>
            ))}
        </Box>
    </Box>
);

export default Marquee;
