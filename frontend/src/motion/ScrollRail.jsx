import { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { colors } from '../theme/theme';

const RAIL_X = 16;
const SCROLL_OFFSET = ['start 0.75', 'end 0.4'];

const Step = ({ step, index, total, progress }) => {
    const at = total > 1 ? index / (total - 1) : 0;
    const opacity = useTransform(progress, [Math.max(0, at - 0.18), at], [0.35, 1]);
    const scale = useTransform(progress, [Math.max(0, at - 0.18), at], [0.8, 1]);

    return (
        <Box sx={{ position: 'relative', pl: 6, pb: index === total - 1 ? 0 : { xs: 5, md: 7 } }}>
            <motion.div
                style={{
                    position: 'absolute',
                    left: RAIL_X - 7,
                    top: 2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: colors.punch,
                    opacity,
                    scale,
                }}
            />

            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{step.title}</Typography>
            <Typography color="text.secondary">{step.description}</Typography>
        </Box>
    );
};

// A vertical rail that fills as the section scrolls past, with each step's
// dot lighting up in turn — used only where the content is a real sequence.
const ScrollRail = ({ steps }) => {
    const reduced = useReducedMotion();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: SCROLL_OFFSET });
    const railScaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 32 });

    return (
        <Box ref={ref} sx={{ position: 'relative' }}>
            <Box
                sx={{
                    position: 'absolute',
                    left: RAIL_X,
                    top: 8,
                    bottom: 8,
                    width: 2,
                    bgcolor: 'divider',
                }}
            />

            {!reduced && (
                <motion.div
                    style={{
                        position: 'absolute',
                        left: RAIL_X,
                        top: 8,
                        bottom: 8,
                        width: 2,
                        scaleY: railScaleY,
                        transformOrigin: 'top',
                        background: `linear-gradient(180deg, ${colors.punch}, ${colors.grape})`,
                    }}
                />
            )}

            {steps.map((step, index) => (
                <Step key={step.title} step={step} index={index} total={steps.length} progress={scrollYProgress} />
            ))}
        </Box>
    );
};

export default ScrollRail;
