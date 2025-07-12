import renderQueryState from "@/components/RenderQueryState";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import type { CoverLetter } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import "../../editor.css";

export const Route = createFileRoute("/cover/$coverId")({
    component: RouteComponent,
});

function RouteComponent() {
    const { coverId } = Route.useParams();

    const cover = useQuery({
        queryKey: ["cover", coverId],
        queryFn: () => requests.get<{ cover: CoverLetter }>(`/cover/${coverId}`, {}),
    });
    const coverState = renderQueryState({
        query: cover,
        noFound: "cover letter",
        skeleton: {
            count: 1,
            className: "h-[400px]",
        },
    });

    return (
        <Authorised>
            <div>
                <h1 className="text-2xl font-semibold">{cover.data?.cover.name || "Loading..."}</h1>
                {/* edit buttons */}
            </div>

            <div className="mt-8 p-4 border rounded-md">
                {coverState !== null ? (
                    coverState
                ) : (
                    <div
                        className="tiptap"
                        dangerouslySetInnerHTML={{ __html: cover.data?.cover.letter || "" }}
                    />
                )}
            </div>
        </Authorised>
    );
}
