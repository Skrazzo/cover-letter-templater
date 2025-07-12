import { createFileRoute, Link } from "@tanstack/react-router";
import Authorised from "@/layouts/Authorised";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import requests from "@/lib/requests";
import type { CoverLetterPreview } from "@/types/api";
import renderQueryState from "@/components/RenderQueryState";

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

            <div className="flex flex-col gap-2 mt-4">
                {lettersState !== null
                    ? lettersState
                    : letters.data?.covers.map((l) => (
                          <Link
                              className="px-3 py-2 cursor-pointer rounded hover:bg-secondary"
                              to={"/cover/$coverId"}
                              params={{ coverId: l.id.toString() }}
                              key={l.id}
                          >
                              <p>{l.name}</p>
                          </Link>
                      ))}
            </div>
        </Authorised>
    );
}
