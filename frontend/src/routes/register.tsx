import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppForm } from "@/hooks/formHook";
import Guest from "@/layouts/Guest";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as z from "zod/v4";

export const Route = createFileRoute("/register")({
    component: RouteComponent,
});

const registerSchema = z
    .object({
        email: z.string().email(),
        name: z.string().min(2, "Name is too short"),
        password: z.string().min(8, "Password is too short"),
        repeatPassword: z.string().min(8, "Password is too short"),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords don't match",
        path: ["repeatPassword"],
    });

function RouteComponent() {
    const form = useAppForm({
        defaultValues: {
            email: "",
            password: "",
            name: "",
            repeatPassword: "",
        },
        validators: {
            onBlur: registerSchema,
        },
        onSubmit: ({ value }) => {
            console.log(value);
        },
    });

    // useEffect(() => {
    //     requests.post<{ message: string }>("/ping", { data: { hello: "world" } });
    // }, []);

    return (
        <Guest className="h-screen w-screen grid place-items-center">
            <Card className="w-full max-w-[400px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create an account</CardDescription>
                    <CardAction>
                        <Button variant={"link"}>
                            <Link to="/login">Login</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="space-y-3">
                    <form.AppField
                        name="email"
                        children={(field) => (
                            <field.TextField
                                label="Email address"
                                placeholder="Your email address"
                                type="email"
                            />
                        )}
                    />

                    <form.AppField
                        name="name"
                        children={(field) => (
                            <field.TextField label="Name" placeholder="Full name or nickname" />
                        )}
                    />

                    <form.AppField
                        name="password"
                        children={(field) => (
                            <field.TextField
                                label="Password"
                                placeholder="Your accounts password"
                                type="password"
                            />
                        )}
                    />

                    <form.AppField
                        name="repeatPassword"
                        children={(field) => (
                            <field.TextField
                                label="Repeat password"
                                placeholder="Repeat your password"
                                type="password"
                            />
                        )}
                    />

                    <Button onClick={form.handleSubmit} className="w-full">
                        Register
                    </Button>
                </CardContent>
            </Card>
        </Guest>
    );
}
