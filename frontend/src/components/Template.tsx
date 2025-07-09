import { withForm } from "@/hooks/formHook";

const Template = withForm({
    defaultValues: {
        name: "",
        template: "",
    },
    props: {},
    render({ form }) {
        return (
            <div className="mt-4 flex flex-col gap-4">
                <form.AppField
                    name="name"
                    children={(f) => <f.TextField label="Name" placeholder="Template name" />}
                />

                <form.AppField name="template" children={(f) => <f.RichTextEdit />} />
            </div>
        );
    },
});

export default Template;
