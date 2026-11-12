import { Fragment } from "react";
import { SELF_AUTHOR } from "@/content/publications";
import { cx } from "@/utils/cx";

/** Author list with Ziyuan's name emphasized. */
export const AuthorList = ({ authors, className }: { authors: string[]; className?: string }) => (
    <p className={cx("text-sm text-tertiary", className)}>
        {authors.map((author, index) => (
            <Fragment key={author}>
                {index > 0 && ", "}
                {author === SELF_AUTHOR ? (
                    <strong className="font-semibold text-primary underline decoration-brand-300 decoration-2 underline-offset-[3px] dark:decoration-brand-700">
                        {author}
                    </strong>
                ) : (
                    author
                )}
            </Fragment>
        ))}
    </p>
);
