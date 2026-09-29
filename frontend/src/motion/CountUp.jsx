import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

// Counts up from 0 to `value` whenever it settles to its real number
// (typically once, when the data it reflects finishes loading). Only ever
// used for above-the-fold numbers, so it animates directly rather than
// gating on IntersectionObserver visibility — that added an extra failure
// mode (a layout shift caused by the very data loading could flip
// useInView's reading back to false and permanently strand the counter
// at 0) for content that's always on screen anyway.
const CountUp = ({ value, duration = 0.8, suffix = '' }) => {
    const reduced = useReducedMotion();
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (reduced) return undefined;

        const controls = animate(0, value, {
            duration,
            ease: [0.33, 1, 0.68, 1], // ease-out-cubic
            onUpdate: (v) => setDisplay(Math.round(v)),
        });

        return () => controls.stop();
    }, [value, reduced, duration]);

    return (
        <span>
            {reduced ? value : display}
            {suffix}
        </span>
    );
};

export default CountUp;
