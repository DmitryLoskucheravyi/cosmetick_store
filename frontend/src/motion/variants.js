// Centralized timing so every hand-written animation in src/motion and the
// components that use it move at the same speed/easing as each other and as
// the CSS transitions in styles/main.css.
export const EASE = [0.4, 0, 0.2, 1];

export const DURATION = {
    fast: 0.25,
    base: 0.4,
    slow: 0.6,
};

export const SPRING = {
    snappy: { type: 'spring', stiffness: 300, damping: 20 },
    soft: { type: 'spring', stiffness: 150, damping: 18 },
};

export const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE } },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
    hidden: {},
    show: {
        transition: { staggerChildren: stagger, delayChildren },
    },
});
