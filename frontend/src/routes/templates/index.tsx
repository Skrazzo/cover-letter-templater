import { Button } from "@/components/ui/button";
import Authorised from "@/layouts/Authorised";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/templates/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Authorised>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">0 Templates</h1>

                <Link to="/templates/create">
                    <Button icon={<Plus />} variant="secondary">
                        Create new
                    </Button>
                </Link>
            </div>
        </Authorised>
    );
}
