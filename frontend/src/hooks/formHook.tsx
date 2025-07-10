import RichTextEdit from "@/components/forms/RichTextEdit";
import TextField from "@/components/forms/TextField";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
    fieldComponents: {
        TextField,
        RichTextEdit,
    },
    formComponents: {},
    fieldContext,
    formContext,
});
