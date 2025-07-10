import Template from "@/components/Template";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/formHook";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import * as z from "zod/v4";

export const Route = createFileRoute("/templates/create")({
    component: RouteComponent,
});

const TemplateSchema = z.object({
    name: z
        .string()
        .nonempty("Name is required")
        .min(2, "Name is too short")
        .max(50, "Name is too long (max 50)"),
    template: z.string().nonempty("Template is required").min(50, "Template is too short"),
});

function RouteComponent() {
    const loading = useState(false);
    const navigate = useNavigate();
    const createForm = useAppForm({
        defaultValues: {
            name: "",
            template: "",
        },
        validators: {
            onBlur: TemplateSchema,
        },
        onSubmit: ({ value }) => {
            requests.post("/templates", {
                before() {
                    loading[1](true);
                },
                finally() {
                    loading[1](false);
                },
                success() {
                    navigate({ to: "/templates" });
                },
                data: value,
            });
        },
    });

    return (
        <Authorised>
            <h1 className="text-2xl font-bold text-primary">Create new template</h1>
            <div className="border rounded-md p-4 bg-orange-50 mt-4">
                <p className="mb-2 text-orange-400 font-bold">NOTE!</p>
                <p>
                    Places that you want AI to fill, need to be in this format{" "}
                    <span className="font-semibold">{"<what to fill>"}</span>. For example:
                </p>

                <p className="mt-2">
                    Hello <span className="font-bold">{"<company name>"}</span> Team
                </p>
                <p>
                    My experiences{" "}
                    <span className="font-bold">{"<required experiences separated by comma>"}</span>
                </p>
                <p>
                    My experiences:{" "}
                    <span className="font-bold">{"<required experiences in unordered list>"}</span>
                </p>
                <p>etc...</p>
            </div>
            <Template form={createForm} />
            <Button onClick={createForm.handleSubmit} disabled={loading[0]} className="mt-4">
                Create
            </Button>
        </Authorised>
    );
}
