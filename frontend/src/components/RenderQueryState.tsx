import type { UseQueryResult } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

interface Props {
    query: UseQueryResult<any, Error>;
    noFound: string;
    skeleton?: {
        count?: number;
        className?: string;
    };
}

export default function renderQueryState({
    query,
    noFound,
    skeleton = { count: 5, className: "h-10" },
}: Props) {
    // Render loading
    if (query.isPending) {
        const skelets = new Array(skeleton.count).fill(null);
        return skelets.map((_, i) => <Skeleton className={skeleton.className} key={i} />);
    }

    // Render error
    if (query.isError) {
        return <div className="text-danger font-bold">Error: {query.error.message}</div>;
    }

    // Render null
    if (query.data === null) {
        return <div className="text-primary">No {noFound} found</div>;
    }

    return null; // Render actual component
}
