import type { CoverLetterPreview } from "@/types/api";
import { Link } from "@tanstack/react-router";

export default ({ cover }: { cover: CoverLetterPreview }) => {
    return (
        <Link to={"/cover/$coverId"} params={{ coverId: cover.id.toString() }}>
            <div className="p-4 border rounded-lg hover:bg-muted/40">
                <h2 className="text-xl font-semibold">{cover.name}</h2>
            </div>
        </Link>
    );
};
