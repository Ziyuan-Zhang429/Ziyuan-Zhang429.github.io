import { type RefObject, useEffect, useState } from "react";

/** True while the element is on screen and the tab is visible. */
export const useIsVisible = (ref: RefObject<HTMLElement | null>) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        let inView = true;
        const update = () => setVisible(inView && document.visibilityState === "visible");
        const observer = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            update();
        });
        observer.observe(element);
        document.addEventListener("visibilitychange", update);
        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", update);
        };
    }, [ref]);

    return visible;
};
