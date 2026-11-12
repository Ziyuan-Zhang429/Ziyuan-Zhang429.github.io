import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/utils/cx";

export const Container = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
    <div {...props} className={cx("mx-auto w-full max-w-6xl px-5 md:px-8", className)} />
);
