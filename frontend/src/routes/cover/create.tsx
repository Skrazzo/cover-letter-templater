import renderQueryState from "@/components/RenderQueryState";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/formHook";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import type { Template } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

export const Route = createFileRoute("/cover/create")({
    component: RouteComponent,
});

const createSchema = z.object({
    templateId: z.string().min(1, "Please select template"),
    application: z.string().min(50, "Application is too short"),
});

function RouteComponent() {
    const templates = useQuery({
        queryKey: ["user_templates"],
        queryFn: () => requests.get<Template[]>("/templates", {}),
    });
    const templateState = renderQueryState({
        query: templates,
        noFound: "templates",
        skeleton: { count: 1, className: "h-16" },
    });

    const form = useAppForm({
        defaultValues: {
            templateId: "",
            application: "Paste job application here",
        },
        validators: {
            onBlur: createSchema,
        },
        onSubmit({ value }) {
            console.log(JSON.stringify(value));
        },
    });

    return (
        <Authorised>
            <h1 className="text-2xl font-bold text-primary">Create new cover letter</h1>
            <div className="border p-4 mt-4 rounded-md">
                {templateState !== null ? (
                    templateState
                ) : (
                    <form.AppField
                        name="templateId"
                        children={(f) => (
                            <f.SelectField
                                data={templates.data?.map((t) => ({ value: `${t.id}`, name: t.name }))}
                                label={"Select template for cover letter"}
                            />
                        )}
                    />
                )}
            </div>

            <div className="mt-4">
                <form.AppField name="application" children={(f) => <f.RichTextEdit />} />
            </div>

            <Button onClick={form.handleSubmit} className="mt-4">
                Generate cover letter
            </Button>
        </Authorised>
    );
}
