import "../../editor.css";
import { useFieldContext } from "@/hooks/formHook";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "../ui/button";
import Link from "@tiptap/extension-link";
import {
    BoldIcon,
    CodeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ItalicIcon,
    ListIcon,
    ListOrderedIcon,
    PilcrowIcon,
    QuoteIcon,
    StrikethroughIcon,
} from "lucide-react";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return;
    }

    return (
        <div className="control-group">
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-accent" : ""}
                >
                    <BoldIcon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-accent" : ""}
                >
                    <ItalicIcon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? "bg-accent" : ""}
                >
                    <StrikethroughIcon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                    className={editor.isActive("code") ? "bg-accent" : ""}
                >
                    <CodeIcon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive("paragraph") ? "bg-accent" : ""}
                >
                    <PilcrowIcon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
                >
                    <Heading1Icon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
                >
                    <Heading2Icon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
                >
                    <Heading3Icon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-accent" : ""}
                >
                    <ListIcon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "bg-accent" : ""}
                >
                    <ListOrderedIcon />
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive("blockquote") ? "bg-accent" : ""}
                >
                    <QuoteIcon />
                </Button>
            </div>
        </div>
    );
};

const extensions = [
    TextStyle.configure(),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: true,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
    Link.configure({
        defaultProtocol: "https",
    }),
];

export default () => {
    // Get field with predefined text type
    const field = useFieldContext<string>();

    // Configure editor
    const editor = useEditor({
        onUpdate: ({ editor }) => field.handleChange(editor.getHTML()),
        onBlur: () => field.handleBlur(),
        content: field.state.value,
        extensions,
    });

    // Render custom field
    return (
        <div>
            <div className="tiptap-container">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
            </div>
            {!field.state.meta.isValid && (
                <span className="text-xs text-danger mt-1">
                    {field.state.meta.errors.map((e) => e.message).join(", ")}
                </span>
            )}
        </div>
    );
};
