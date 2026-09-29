import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const RADIUS = 60; // px within which the pull is felt
const PULL = 8; // px max offset toward the cursor

// The element leans toward the cursor within a small radius and springs
// back to rest the moment the pointer leaves.
const MagneticButton = ({ children, style }) => {
    const reduced = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 250, damping: 15 });
    const springY = useSpring(y, { stiffness: 250, damping: 15 });

    if (reduced) {
        return <span style={style}>{children}</span>;
    }

    const handlePointerMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(relX, relY);

        if (distance < RADIUS) {
            x.set((relX / RADIUS) * PULL);
            y.set((relY / RADIUS) * PULL);
        } else {
            x.set(0);
            y.set(0);
        }
    };

    const handlePointerLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.span
            style={{ display: 'inline-block', x: springX, y: springY, ...style }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {children}
        </motion.span>
    );
};

export default MagneticButton;
