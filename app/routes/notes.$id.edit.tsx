import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData, useActionData } from "@remix-run/react";
import { ZodError } from "zod";
import { getNoteById, updateNote } from "~/db/notes";
import { UpdateNoteSchema } from "~/db/schema";
import NoteForm from "~/components/NoteForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App - Edit Note" },
    { name: "description", content: "Edit an existing note" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const noteId = params.id;
  
  if (!noteId) {
    throw new Response("Note ID is required", { status: 400 });
  }
  
  const note = await getNoteById(noteId);
  
  if (!note) {
    throw new Response("Note not found", { status: 404 });
  }
  
  return json({ note });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const noteId = params.id;
  
  if (!noteId) {
    return json({ errors: [{ message: "Note ID is required" }] }, { status: 400 });
  }
  
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  
  try {
    // Validate the input data
    const validatedData = UpdateNoteSchema.parse({ id: noteId, title, content });
    
    // Update the note
    const updatedNote = await updateNote(noteId, validatedData);
    
    if (!updatedNote) {
      return json({ errors: [{ message: "Note not found" }] }, { status: 404 });
    }
    
    // Redirect to the home page
    return redirect("/");
  } catch (error) {
    if (error instanceof ZodError) {
      // Return validation errors
      return json({ errors: error.errors }, { status: 400 });
    }
    
    // Return a generic error
    return json({ errors: [{ message: "Failed to update note" }] }, { status: 500 });
  }
}

export default function EditNote() {
  const { note } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Note</h1>
      
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
      
      <NoteForm note={note} formAction={`/notes/${note.id}/edit`} />
    </div>
  );
}
