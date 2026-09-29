import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

const MAX_TILT = 4; // degrees

// Card tilts toward the cursor in 3D (±4°), spring-smoothed, and
// relaxes back to flat the moment the pointer leaves.
const TiltCard = ({ children, className, style }) => {
    const reduced = useReducedMotion();
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const springX = useSpring(x, { stiffness: 300, damping: 25 });
    const springY = useSpring(y, { stiffness: 300, damping: 25 });

    const rotateX = useTransform(springY, [0, 1], [MAX_TILT, -MAX_TILT]);
    const rotateY = useTransform(springX, [0, 1], [-MAX_TILT, MAX_TILT]);

    if (reduced) {
        return (
            <div className={className} style={style}>
                {children}
            </div>
        );
    }

    const handlePointerMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width);
        y.set((e.clientY - rect.top) / rect.height);
    };

    const handlePointerLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <motion.div
            className={className}
            style={{ ...style, perspective: 800 }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>{children}</motion.div>
        </motion.div>
    );
};

export default TiltCard;
