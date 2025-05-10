import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { useActionData } from "@remix-run/react";
import { ZodError } from "zod";
import { createNote } from "~/db/notes";
import { CreateNoteSchema } from "~/db/schema";
import { initializeDb } from "~/db/client";
import NoteForm from "~/components/NoteForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App - Create New Note" },
    { name: "description", content: "Create a new note" },
  ];
};

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  try {
    // Initialize the database
    const db = await initializeDb(context.env);

    // Validate the input data
    const validatedData = CreateNoteSchema.parse({ title, content });

    // Create the note
    await createNote(validatedData, db);

    // Redirect to the home page
    return redirect("/");
  } catch (error) {
    if (error instanceof ZodError) {
      // Return validation errors
      return json({ errors: error.errors }, { status: 400 });
    }

    // Return a generic error
    return json({ errors: [{ message: "Failed to create note" }] }, { status: 500 });
  }
}

export default function NewNote() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Note</h1>

      {actionData?.errors && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                There were errors with your submission
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {actionData.errors.map((error: any, index: number) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <NoteForm />
    </div>
  );
}
