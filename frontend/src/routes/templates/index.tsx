import { Button } from "@/components/ui/button";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Template } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/templates/")({
    component: RouteComponent,
});

function RenderTemplates({ templates }: { templates: UseQueryResult<null | Template[], Error> }) {
    // Render loading
    if (templates.isPending) {
        const skelets = new Array(5).fill(null);
        return skelets.map((_, i) => <Skeleton className="h-10" key={i} />);
    }

    // Render error
    if (templates.isError) {
        return <div className="text-danger font-bold">Error: {templates.error.message}</div>;
    }

    // Render null
    if (templates.data === null) {
        return <div className="text-primary">No templates found</div>;
    }

    return templates.data.map((template, i) => (
        <div className="flex gap-2 items-center" key={i}>
            <p className="text-lg">{template.name}</p>
        </div>
    ));
}

function RouteComponent() {
    const templates = useQuery({
        queryKey: ["user_templates"],
        queryFn: () => requests.get<Template[]>("/templates", {}),
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

            <div className="flex flex-col gap-2 mt-4">
                <RenderTemplates templates={templates} />
            </div>
        </Authorised>
    );
}
