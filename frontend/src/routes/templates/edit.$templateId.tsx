import renderQueryState from "@/components/RenderQueryState";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/formHook";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import type { Template } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod/v4";

export const Route = createFileRoute("/templates/edit/$templateId")({
    component: RouteComponent,
});

const editSchema = z.object({
    name: z.string().min(1, "Name is required"),
    content: z.string().min(50, "Template is too short"),
});

function RouteComponent() {
    const { templateId } = Route.useParams();
    const navigate = useNavigate();
    const loading = useState(false);

    const template = useQuery({
        queryKey: ["template", templateId],
        queryFn: () => requests.get<{ template: Template }>(`/template/${templateId}`, {}),
    });
    const templateState = renderQueryState({
        query: template,
        noFound: "template",
        skeleton: {
            count: 1,
            className: "h-[400px]",
        },
    });

    const edit = useAppForm({
        defaultValues: {
            name: template.data?.template.name || "",
            content: template.data?.template.content || null,
        },
        validators: {
            onBlur: editSchema,
        },
        onSubmit({ value }) {
            requests.put(`/template/${templateId}`, {
                data: value,
                before() {
                    loading[1](true);
                },
                finally() {
                    loading[1](false);
                },
                success() {
                    navigate({ to: "/templates/$templateId", params: { templateId: templateId } });
                },
            });
        },
    });

    return (
        <Authorised>
            <h1 className="text-2xl font-bold text-primary">Edit template</h1>

            <div className="mt-4 space-y-4">
                <edit.AppField
                    name="name"
                    children={(f) => <f.TextField label="Name" placeholder="Your template name" />}
                />

                {templateState !== null ? (
                    templateState
                ) : (
                    <edit.AppField name="content" children={(f) => <f.RichTextEdit />} />
                )}
            </div>

            <Button className="mt-4" onClick={edit.handleSubmit}>
                Save
            </Button>
        </Authorised>
    );
}
