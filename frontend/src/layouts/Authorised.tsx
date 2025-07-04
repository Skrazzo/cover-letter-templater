import Header from "@/components/Header";
import Container from "@/components/ui/container";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Authorised({ children, className = "" }: Props) {
    return (
        <>
            <Header />
            <Container>{children}</Container>
        </>
    );
}
