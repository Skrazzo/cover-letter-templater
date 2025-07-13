import type { TemplatePreview } from "@/types/api";
import { Link } from "@tanstack/react-router";

export default function Template({ template }: { template: TemplatePreview }) {
    return (
        <Link to={"/templates/$templateId"} params={{ templateId: template.id.toString() }}>
            <div className="p-4 border rounded-lg hover:bg-muted/40">
                <h2 className="text-xl font-semibold">{template.name}</h2>
            </div>
        </Link>
    );
}

