import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { deleteNote } from "~/db/notes";

export async function action({ params }: ActionFunctionArgs) {
  const noteId = params.id;
  
  if (!noteId) {
    throw new Response("Note ID is required", { status: 400 });
  }
  
  const success = await deleteNote(noteId);
  
  if (!success) {
    throw new Response("Note not found", { status: 404 });
  }
  
  return redirect("/");
}

// This route doesn't render anything, it just handles the delete action
export default function DeleteNote() {
  return null;
}
