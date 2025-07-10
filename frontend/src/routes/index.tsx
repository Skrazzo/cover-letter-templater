import { createFileRoute } from "@tanstack/react-router";
import Authorised from "@/layouts/Authorised";

export const Route = createFileRoute("/")({
    component: App,
});

function App() {
    return (
        <Authorised>
            <h1>Welcome to cover letter</h1>
        </Authorised>
    );
}
