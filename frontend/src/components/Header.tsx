import { Link } from "@tanstack/react-router";
import { House } from "lucide-react";

export default function Header() {
    return (
        <header className="py-3 px-4 flex gap-2 bg-panel text-black justify-between shadow">
            <nav className="flex flex-row font-bold">
                <Link to="/" className="flex items-center gap-2">
                    <House size={20} />
                    Home
                </Link>
            </nav>
        </header>
    );
}
