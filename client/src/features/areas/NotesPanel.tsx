import { useState, type FormEvent } from 'react';
import { Button } from '../../components/Button';
import type { Note } from './types';

const timestampFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

interface NotesPanelProps {
  initialNotes: Note[];
  /** Name shown on notes the signed-in user adds. */
  authorName?: string;
}

export const NotesPanel = ({ initialNotes, authorName = 'Me' }: NotesPanelProps) => {
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setNotes((current) => [
      ...current,
      { id: crypto.randomUUID(), author: authorName, timestamp: new Date().toISOString(), body },
    ]);
    setDraft('');
  };

  return (
    <article className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
      <h2 className="font-serif text-xl sm:text-2xl">Notes</h2>

      <ul className="mt-4 flex flex-col gap-3">
        {notes.map(({ id, author, timestamp, body }) => (
          <li
            key={id}
            className={`rounded-xl p-4 ${author === authorName ? 'bg-sand' : 'bg-canvas'}`}
          >
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-sm font-semibold">{author}</span>
              <time dateTime={timestamp} className="text-xs text-ink-muted">
                {timestampFormat.format(new Date(timestamp))}
              </time>
            </div>
            <p className="mt-2 text-sm">{body}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <label htmlFor="new-note" className="text-sm font-medium">
          Add a note
        </label>
        <textarea
          id="new-note"
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-base focus:outline-2 focus:outline-brand-600"
        />
        <Button type="submit" disabled={!draft.trim()} className="self-end">
          Add note
        </Button>
      </form>
    </article>
  );
};
