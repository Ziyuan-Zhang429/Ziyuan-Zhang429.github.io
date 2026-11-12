import { type RefObject, useLayoutEffect, useState } from "react";

export interface ElementSize {
    width: number;
    height: number;
}

/**
 * The element's rendered size, measured before paint and kept current with a ResizeObserver.
 * `widthStep` rounds the width so small layout shifts don't trigger work downstream.
 */
export const useElementSize = (ref: RefObject<HTMLElement | null>, initial: ElementSize, widthStep = 1) => {
    const [size, setSize] = useState(initial);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;
        const measure = () => {
            const rect = element.getBoundingClientRect();
            const width = Math.round(rect.width / widthStep) * widthStep;
            const height = Math.round(rect.height);
            setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [ref, widthStep]);

    return size;
};
