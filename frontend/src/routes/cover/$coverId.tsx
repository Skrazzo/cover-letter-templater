import renderQueryState from "@/components/RenderQueryState";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import type { CoverLetter } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import "../../editor.css";
import { toPng } from "html-to-image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, EditIcon, Trash2 } from "lucide-react";

export const Route = createFileRoute("/cover/$coverId")({
    component: RouteComponent,
});

function RouteComponent() {
    const { coverId } = Route.useParams();
    const navigate = useNavigate();

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

    // Handle png downloads
    const coverRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (coverRef.current === null) return;

        const dataUrl = await toPng(coverRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            skipFonts: false,
        });
        const link = document.createElement("a");
        link.download = `${cover.data?.cover.name || "Cover"}.png`;
        link.href = dataUrl;
        link.click();
    };

    const handleDelete = async () => {
        const a = confirm("Are you sure?");
        if (!a) return;

        requests.delete(`/cover/${coverId}`, {
            success() {
                navigate({ to: "/" });
            },
        });
    };

    return (
        <Authorised>
            <div className="flex items-center gap-4 mb-8 md:justify-between">
                <h1 className="text-2xl font-semibold">{cover.data?.cover.name || "Loading..."}</h1>

                <div className="space-x-2">
                    <Button
                        className="hover:bg-danger hover:text-background"
                        variant="ghost"
                        onClick={handleDelete}
                    >
                        <Trash2 />
                    </Button>
                    <Link
                        to={"/cover/edit/$coverId"}
                        params={{ coverId: cover.data?.cover.id.toString() || "" }}
                    >
                        <Button variant="outline">
                            <EditIcon />
                        </Button>
                    </Link>
                    <Button onClick={handleDownload}>
                        <DownloadIcon />
                    </Button>
                </div>
            </div>

            <div ref={coverRef} className="bg-background p-4 border">
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
