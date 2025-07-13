import { createFileRoute, Link } from "@tanstack/react-router";
import Authorised from "@/layouts/Authorised";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import requests from "@/lib/requests";
import type { CoverLetterPreview } from "@/types/api";
import renderQueryState from "@/components/RenderQueryState";
import CoverLetter from "@/components/CoverLetterLink";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    const letters = useQuery({
        queryKey: ["cover_letters"],
        queryFn: () => requests.get<{ covers: CoverLetterPreview[] }>("/cover", {}),
    });
    const lettersState = renderQueryState({
        query: letters,
        noFound: "cover letters",
    });

    return (
        <Authorised>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">
                    {letters.data?.covers.length} Cover letters
                </h1>

                <Link to="/cover/create">
                    <Button icon={<Plus />} variant="secondary">
                        Create new
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {lettersState !== null
                    ? lettersState
                    : letters.data?.covers.map((l) => <CoverLetter cover={l} />)}
            </div>
        </Authorised>
    );
}
