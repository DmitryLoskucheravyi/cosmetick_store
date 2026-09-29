import { useLayoutEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useLocation } from 'react-router-dom';

const canAnimate = () =>
    typeof document !== 'undefined' &&
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Wraps route swaps in the browser's native View Transition API so
// navigating between pages cross-fades instead of hard-cutting.
// No React canary required — this drives document.startViewTransition
// directly, keyed off the location react-router already gives us.
export const useViewTransitionLocation = () => {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);

    useLayoutEffect(() => {
        if (!canAnimate() || location.key === displayLocation.key) return;

        document.startViewTransition(() => {
            flushSync(() => setDisplayLocation(location));
        });
    }, [location, displayLocation.key]);

    return canAnimate() ? displayLocation : location;
};
