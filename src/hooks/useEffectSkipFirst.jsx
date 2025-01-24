import { useEffect, useRef } from 'react';

/**
 * A custom hook similar to useEffect, but it does NOT run on the initial render.
 *
 * @param {Function} effectCallback - The callback function to be run after the first render.
 * @param {Array} dependencies - The dependency array for the effect.
 */
export function useEffectSkipFirst(effectCallback, dependencies) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the effect on the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Run the callback on subsequent renders
    return effectCallback();
  }, dependencies);
}
