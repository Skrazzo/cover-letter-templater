import { Button } from "@/components/ui/button";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { TemplatePreview } from "@/types/api";
import renderQueryState from "@/components/RenderQueryState";
import Template from "@/components/TemplateLink";

export const Route = createFileRoute("/templates/")({
    component: RouteComponent,
});

function RouteComponent() {
    const templates = useQuery({
        queryKey: ["user_templates"],
        queryFn: () => requests.get<TemplatePreview[]>("/templates", {}),
    });
    const templatesState = renderQueryState({
        query: templates,
        noFound: "templates",
        skeleton: {
            count: 6,
            className: "h-15",
        },
    });

    return (
        <Authorised>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">{templates.data?.length} Templates</h1>

                <Link to="/templates/create">
                    <Button icon={<Plus />} variant="secondary">
                        Create new
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {templatesState !== null
                    ? templatesState
                    : templates.data?.map((template, i) => <Template template={template} key={i} />)}
            </div>
        </Authorised>
    );
}
