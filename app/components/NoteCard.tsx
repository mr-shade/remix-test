import { Link, Form } from '@remix-run/react';
import { formatDistanceToNow } from 'date-fns';
import type { Note } from '~/db/schema';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
        <div className="flex space-x-2">
          <Link
            to={`/notes/${note.id}/edit`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </Link>
          <Form method="post" action={`/notes/${note.id}/delete`}>
            <button
              type="submit"
              className="text-red-600 hover:text-red-900"
              onClick={(e) => {
                if (!confirm('Are you sure you want to delete this note?')) {
                  e.preventDefault();
                }
              }}
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Created {formatDistanceToNow(note.created_at, { addSuffix: true })}</p>
        {note.updated_at > note.created_at && (
          <p>Updated {formatDistanceToNow(note.updated_at, { addSuffix: true })}</p>
        )}
      </div>
    </div>
  );
}
