import renderQueryState from "@/components/RenderQueryState";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/formHook";
import Authorised from "@/layouts/Authorised";
import requests from "@/lib/requests";
import type { CoverLetter } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod/v4";

export const Route = createFileRoute("/cover/edit/$coverId")({
    component: RouteComponent,
});

const editSchema = z.object({
    name: z.string().min(1, "Name is required"),
    letter: z.string().min(50, "Application is too short"),
});

function RouteComponent() {
    const { coverId } = Route.useParams();
    const navigate = useNavigate();
    const loading = useState(false);

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

    const edit = useAppForm({
        defaultValues: {
            name: cover.data?.cover.name || "",
            letter: cover.data?.cover.letter || null,
        },
        validators: {
            onBlur: editSchema,
        },
        onSubmit({ value }) {
            requests.put(`/cover/${coverId}`, {
                data: value,
                before() {
                    loading[1](true);
                },
                finally() {
                    loading[1](false);
                },
                success() {
                    navigate({ to: "/cover/$coverId", params: { coverId: coverId } });
                },
            });
        },
    });

    return (
        <Authorised>
            <h1 className="text-2xl font-bold text-primary">Edit cover letter</h1>

            <div className="mt-4 space-y-4">
                <edit.AppField
                    name="name"
                    children={(f) => <f.TextField label="Name" placeholder="Your cover letter name" />}
                />

                {coverState !== null ? (
                    coverState
                ) : (
                    <edit.AppField name="letter" children={(f) => <f.RichTextEdit />} />
                )}
            </div>

            <Button className="mt-4" onClick={edit.handleSubmit}>
                Save
            </Button>
        </Authorised>
    );
}
