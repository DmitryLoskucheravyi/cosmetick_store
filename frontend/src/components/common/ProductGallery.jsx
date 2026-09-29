import { useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../theme/theme';

// Main image + thumbnail strip. The active slide carries the shared
// view-transition name so a card-to-detail navigation still morphs the
// same photo the shopper clicked, regardless of which slide it lands on.
const ProductGallery = ({ images, alt, viewTransitionName }) => {
    const [active, setActive] = useState(0);
    const slides = images.length ? images : ['https://placehold.co/600x600'];

    return (
        <Box>
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: '20px',
                    bgcolor: colors.canvas,
                    p: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 360,
                    overflow: 'hidden',
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={active}
                        src={slides[active]}
                        alt={alt}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: '100%',
                            maxWidth: 420,
                            objectFit: 'contain',
                            viewTransitionName: active === 0 ? viewTransitionName : undefined,
                        }}
                    />
                </AnimatePresence>
            </Box>

            {slides.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                    {slides.map((src, index) => (
                        <Box
                            key={src + index}
                            component="button"
                            type="button"
                            onClick={() => setActive(index)}
                            aria-label={`View image ${index + 1}`}
                            aria-current={index === active}
                            sx={{
                                width: 64,
                                height: 64,
                                p: 0,
                                borderRadius: '10px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                bgcolor: colors.canvas,
                                border: '1px solid',
                                borderColor: index === active ? colors.punch : colors.line,
                                transition: '.2s',
                                flexShrink: 0,
                                '&:hover': { borderColor: colors.punch },
                            }}
                        >
                            <Box
                                component="img"
                                src={src}
                                alt=""
                                sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ProductGallery;
