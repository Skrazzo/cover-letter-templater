import Header from "@/components/Header";
import Container from "@/components/ui/container";
import requests from "@/lib/requests";
import { useQuery } from "@tanstack/react-query";
import type { TokenUserInfo } from "@/types/api";

interface Props {
    children: React.ReactNode;
    className?: string;
}

export default function Authorised({ children, className = "" }: Props) {
    // Check authentication
    const info = useQuery({
        queryKey: ["user_info"],
        queryFn: () => requests.get<TokenUserInfo>("/info", {}),
        staleTime: 60 * 1000, // 1 minutes
    });

    return (
        <>
            <Header />
            <Container>{children}</Container>
        </>
    );
}
