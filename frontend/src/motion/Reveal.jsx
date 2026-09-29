import { useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { fadeUp } from './variants';

// Fades an element up into place the first time it scrolls into view.
// Pattern: fade-up on scroll (opacity 0→1, y 24→0), fires once.
//
// Drives the animation off our own latched `hasEntered` state rather than
// framer-motion's declarative `whileInView`: in this app a reveal often
// sits above content that resizes once its data finishes loading (see
// CountUp.jsx), and that layout shift can flip `useInView`'s own returned
// value back to false, silently re-hiding already-revealed content.
const Reveal = ({ as = 'div', children, delay = 0, margin = '-80px', className, style }) => {
    const reduced = useReducedMotion();
    const ref = useRef(null);
    const options = useMemo(() => ({ once: true, margin }), [margin]);
    const inView = useInView(ref, options);
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
            variants={fadeUp}
            transition={{ ...fadeUp.show.transition, delay }}
        >
            {children}
        </Component>
    );
};

export default Reveal;
