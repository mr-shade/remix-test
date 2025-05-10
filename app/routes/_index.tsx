import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { getAllNotes } from "~/db/notes";
import { initializeDb } from "~/db/client";
import NoteCard from "~/components/NoteCard";
import type { Note } from "~/db/schema";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App - All Notes" },
    { name: "description", content: "A simple notes app built with Remix and Turso DB" },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  // Initialize the database if it doesn't exist
  await initializeDb();

  // Get all notes
  const notes = await getAllNotes();

  return json({ notes });
}

export default function Index() {
  const { notes } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
        <Link
          to="/notes/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-medium text-gray-900">No notes yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first note.
          </p>
          <div className="mt-6">
            <Link
              to="/notes/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Note
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note: Note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
