import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from './variants';

// Stable reference — see Reveal.jsx for why this matters.
const VIEWPORT_OPTIONS = { once: true, margin: '-60px' };

// Parent carries no animation of its own — it only staggers when its
// children (StaggerItem) reveal, once, as the group scrolls into view.
// Latches its own `hasEntered` flag rather than trusting framer-motion's
// `whileInView` to stay true forever — see Reveal.jsx/CountUp.jsx for why.
export const StaggerGroup = ({ as = 'div', stagger = 0.08, delayChildren = 0, children, className, style }) => {
    const reduced = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, VIEWPORT_OPTIONS);
    const [hasEntered, setHasEntered] = useState(false);

    if (inView && !hasEntered) {
        setHasEntered(true);
    }

    if (reduced) {
        const Static = as;
        return (
            <Static className={className} style={style}>
                {children}
            </Static>
        );
    }

    const Component = motion[as] ?? motion.div;

    return (
        <Component
            ref={ref}
            className={className}
            style={style}
            initial="hidden"
            animate={hasEntered ? 'show' : 'hidden'}
            variants={staggerContainer(stagger, delayChildren)}
        >
            {children}
        </Component>
    );
};

export const StaggerItem = ({ as = 'div', children, className, style }) => {
    const reduced = useReducedMotion();

    if (reduced) {
        const Static = as;
        return (
            <Static className={className} style={style}>
                {children}
            </Static>
        );
    }

    const Component = motion[as] ?? motion.div;

    return (
        <Component className={className} style={style} variants={fadeUp}>
            {children}
        </Component>
    );
};
