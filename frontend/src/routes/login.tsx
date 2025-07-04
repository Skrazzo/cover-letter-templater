import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Guest from "@/layouts/Guest";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
    component: RouteComponent,
});

function RouteComponent() {
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
                <CardContent className="space-y-2">
                    <Input type="email" placeholder="Email address" />
                    <Input type="password" placeholder="Password" />
                    <Button className="w-full">Login</Button>
                </CardContent>
            </Card>
        </Guest>
    );
}
