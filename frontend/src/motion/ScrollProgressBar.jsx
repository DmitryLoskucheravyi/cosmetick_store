import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { colors } from '../theme/theme';

// Thin bar pinned under the header that fills with page scroll progress,
// smoothed with a spring so it doesn't feel like a raw scroll-linked jitter.
const ScrollProgressBar = () => {
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 40, restDelta: 0.001 });

    if (reduced) return null;

    return (
        <motion.div
            aria-hidden
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                transformOrigin: '0%',
                scaleX,
                background: `linear-gradient(90deg, ${colors.punch}, ${colors.grape})`,
                zIndex: 2000,
            }}
        />
    );
};

export default ScrollProgressBar;
