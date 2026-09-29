import { useLayoutEffect, useRef, useState } from 'react';
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
    // Guards against starting a second transition (e.g. a fast double
    // navigation) while one is still resolving — the browser throws
    // "Transition was aborted" / duplicate-name errors when that happens.
    const pendingTransition = useRef(null);

    useLayoutEffect(() => {
        if (location.key === displayLocation.key) return;

        // Only an actual page change should jump the scroll back to the
        // top — Catalog rewrites its own URL (search/category/price) on
        // every filter tweak, which also bumps `location.key`, and users
        // would lose their scroll position mid-filtering otherwise.
        const isNewPage = location.pathname !== displayLocation.pathname;

        if (!canAnimate()) {
            if (isNewPage) window.scrollTo(0, 0);
            flushSync(() => setDisplayLocation(location));
            return;
        }

        const applyLocation = () =>
            flushSync(() => {
                if (isNewPage) window.scrollTo(0, 0);
                setDisplayLocation(location);
            });

        if (pendingTransition.current) {
            pendingTransition.current.finished.finally(applyLocation).catch(() => {});
            return;
        }

        const transition = document.startViewTransition(applyLocation);
        pendingTransition.current = transition;
        transition.finished
            .catch(() => {
                // Aborted transitions (rapid navigation, reduced-motion toggle
                // mid-flight, etc.) are expected — nothing to surface here.
            })
            .finally(() => {
                if (pendingTransition.current === transition) {
                    pendingTransition.current = null;
                }
            });
    }, [location, displayLocation.key, displayLocation.pathname]);

    return canAnimate() ? displayLocation : location;
};
