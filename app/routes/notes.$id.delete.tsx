import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { deleteNote } from "~/db/notes";
import { initializeDb } from "~/db/client";

export async function action({ params, context }: ActionFunctionArgs) {
  const noteId = params.id;

  if (!noteId) {
    throw new Response("Note ID is required", { status: 400 });
  }

  // Initialize the database
  const db = await initializeDb(context.env);

  const success = await deleteNote(noteId, db);

  if (!success) {
    throw new Response("Note not found", { status: 404 });
  }

  return redirect("/");
}

// This route doesn't render anything, it just handles the delete action
export default function DeleteNote() {
  return null;
}
