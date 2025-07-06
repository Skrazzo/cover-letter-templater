import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/hooks/formHook";
import Guest from "@/layouts/Guest";
import requests from "@/lib/requests";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import * as z from "zod/v4";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().nonempty("Password is required"),
});

function RouteComponent() {
    const loading = useState(false);
    const navigate = useNavigate();

    const form = useAppForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onBlur: loginSchema,
        },
        onSubmit: ({ value }) => {
            requests.post<{ message: string }>("/login", {
                data: value,
                before() {
                    // use state to true loading
                    loading[1](true);
                },
                success() {
                    navigate({ to: "/" });
                },
                error() {
                    form.setFieldValue("password", "");
                },
                finally() {
                    loading[1](false);
                },
            });
        },
    });

    return (
        <Guest className="h-screen w-screen grid place-items-center">
            <Card className="w-full max-w-[400px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Log into your account</CardDescription>
                    <CardAction>
                        <Button variant={"link"}>
                            <Link to="/register">Register</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="space-y-3">
                    <form.AppField
                        name="email"
                        children={(f) => (
                            <f.TextField
                                label="Email address"
                                placeholder="Your email address"
                                type="email"
                            />
                        )}
                    />

                    <form.AppField
                        name="password"
                        children={(f) => (
                            <f.TextField
                                label="Password"
                                placeholder="Your accounts password"
                                type="password"
                            />
                        )}
                    />
                    <Button disabled={loading[0]} onClick={form.handleSubmit} className="w-full">
                        Login
                    </Button>
                </CardContent>
            </Card>
        </Guest>
    );
}
