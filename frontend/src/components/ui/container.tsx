export default function Container({ children, className = "" }: React.ComponentProps<"div">) {
    return <div className={`container mx-auto max-w-6xl px-4 mb-16 ${className}`}>{children}</div>;
}
