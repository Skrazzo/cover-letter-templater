import { useFieldContext } from "@/hooks/formHook";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

// --- field components ---
interface TextFieldProps {
    placeholder?: string;
    label?: string;
    type?: React.ComponentProps<"input">["type"];
    maxLength?: React.ComponentProps<"input">["maxLength"];
    className?: string;
}

export default function TextField({
    placeholder,
    type = "text",
    className = "",
    label = "",
    maxLength = 255,
}: TextFieldProps) {
    // Get field with predefined text type
    const field = useFieldContext<string>();

    // Render custom field
    return (
        <div className={cn("flex flex-col", className)}>
            {label && (
                <label htmlFor={field.name} className="ml-1 mb-2 text-secondary-foreground text-sm">
                    {label}
                </label>
            )}

            <Input
                id={field.name}
                maxLength={maxLength}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type={type}
                placeholder={placeholder || `${type} input`}
            />

            {!field.state.meta.isValid && (
                <span className="text-xs text-danger mt-1">
                    {field.state.meta.errors.map((e) => e.message).join(", ")}
                </span>
            )}
        </div>
    );
}
