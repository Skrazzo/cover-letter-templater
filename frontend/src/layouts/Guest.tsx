export default function Guest({ children, className = "" }: React.ComponentProps<"div">) {
    return <div className={`${className}`}>{children}</div>;
}
