import renderQueryState from "@/components/RenderQueryState";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import type { Template } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import "../../editor.css";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2 } from "lucide-react";

export const Route = createFileRoute("/templates/$templateId")({
    component: RouteComponent,
});

function RouteComponent() {
    const { templateId } = Route.useParams();
    const navigate = useNavigate();

    const template = useQuery({
        queryKey: ["template", templateId],
        queryFn: () => requests.get<{ template: Template }>(`/templates/${templateId}`, {}),
    });
    const templateState = renderQueryState({
        query: template,
        noFound: "template",
        skeleton: {
            count: 1,
            className: "h-[400px]",
        },
    });

    const handleDelete = async () => {
        const a = confirm("Are you sure?");
        if (!a) return;

        requests.delete(`/templates/${templateId}`, {
            success() {
                navigate({ to: "/templates" });
            },
        });
    };

    return (
        <Authorised>
            <div className="flex items-center gap-4 mb-8 md:justify-between">
                <h1 className="text-2xl font-semibold">{template.data?.template.name || "Loading..."}</h1>

                <div className="space-x-2">
                    <Button
                        className="hover:bg-danger hover:text-background"
                        variant="ghost"
                        onClick={handleDelete}
                    >
                        <Trash2 />
                    </Button>
                    <Link
                        to={"/templates/edit/$templateId"}
                        params={{ templateId: template.data?.template.id.toString() || "" }}
                    >
                        <Button variant="outline">
                            <EditIcon />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-background p-4 border">
                {templateState !== null ? (
                    templateState
                ) : (
                    <div
                        className="tiptap"
                        dangerouslySetInnerHTML={{ __html: template.data?.template.template || "" }}
                    />
                )}
            </div>
        </Authorised>
    );
}
