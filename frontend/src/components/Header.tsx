import { Link } from "@tanstack/react-router";
import { LayoutTemplate, LetterText, PlusSquare } from "lucide-react";

const linkClass = { className: "flex items-center gap-2" };
const iconProps = { size: 20 };

export default function Header() {
    return (
        <header className="py-3 px-4 flex gap-2 bg-panel text-black justify-between shadow mb-4">
            <nav className="flex items-center gap-4 font-bold ">
                <Link to="/" {...linkClass}>
                    <LetterText {...iconProps} />
                    Covers
                </Link>
                <Link to="/cover/create" {...linkClass}>
                    <PlusSquare {...iconProps} />
                    Create letter
                </Link>
                <Link to="/templates" {...linkClass}>
                    <LayoutTemplate {...iconProps} />
                    Templates
                </Link>
            </nav>
        </header>
    );
}
