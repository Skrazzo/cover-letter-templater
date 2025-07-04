import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Guest from "@/layouts/Guest";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as z from "zod/v4";

export const Route = createFileRoute("/register")({
    component: RouteComponent,
});

const registerSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        repeatPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "Passwords don't match",
        path: ["repeatPassword"],
    });

function RouteComponent() {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            repeatPassword: "",
        },
        validators: {
            onBlur: registerSchema,
        },
        onSubmit: ({ value }) => {
            console.log(value);
        },
    });

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
                <CardContent className="space-y-2">
                    <form.Field
                        name="email"
                        children={(field) => (
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                type="email"
                                placeholder="Email address"
                            />
                        )}
                    />
                    <Input type="password" placeholder="Password" />
                    <Input type="password" placeholder="Repeat password" />
                    <Button onClick={form.handleSubmit} className="w-full">
                        Register
                    </Button>
                </CardContent>
            </Card>
        </Guest>
    );
}
