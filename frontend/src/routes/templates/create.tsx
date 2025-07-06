import Authorised from "@/layouts/Authorised";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/templates/create")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <Authorised>
            <h1 className="text-2xl font-bold text-primary">Create new template</h1>

            {/* TODO: create a create/edit component to which we pass initialData (will be easier for edit functionality) */}
        </Authorised>
    );
}
