import { createFileRoute, Link } from "@tanstack/react-router";
import Authorised from "@/layouts/Authorised";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    return (
        <Authorised>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">0 Cover letters</h1>

                <Link to="/cover/create">
                    <Button icon={<Plus />} variant="secondary">
                        Create new
                    </Button>
                </Link>
            </div>
        </Authorised>
    );
}
