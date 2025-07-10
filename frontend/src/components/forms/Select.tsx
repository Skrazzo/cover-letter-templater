import { useFieldContext } from "@/hooks/formHook";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- field components ---
interface SelectProps {
    label?: string;
    className?: string;
    data:
        | {
              value: any;
              name: any;
          }[]
        | undefined;
}

export default function SelectField({ data, label, className = "" }: SelectProps) {
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

            <Select
                onValueChange={field.handleChange}
                onOpenChange={field.handleBlur}
                defaultValue={field.state.value}
            >
                <SelectTrigger className={"w-full"}>
                    <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                    {data?.map((i) => (
                        <SelectItem value={i.value}>{i.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {!field.state.meta.isValid && (
                <span className="text-xs text-danger mt-1">
                    {field.state.meta.errors.map((e) => e.message).join(", ")}
                </span>
            )}
        </div>
    );
}
