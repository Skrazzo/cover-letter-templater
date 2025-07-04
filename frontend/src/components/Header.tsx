import { Link } from "@tanstack/react-router";
import { IconHome } from "@tabler/icons-react";

export default function Header() {
    return (
        <header className="py-2 px-4 flex gap-2 bg-panel text-black justify-between">
            <nav className="flex flex-row font-bold">
                <Link to="/" className="flex items-center gap-2">
                    <IconHome size={20} />
                    Home
                </Link>
            </nav>
        </header>
    );
}
