const NOTES_KEY = "harmony_block_notes_v1";

export interface BlockNote {
  blockId: string;
  subjectCode: string;
  content: string;
  createdAt: string;
  edited: boolean;
}

export function getBlockNotes(): BlockNote[] {
  try {
    const stored = localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveBlockNote(
  blockId: string,
  subjectCode: string,
  content: string
): void {
  const notes = getBlockNotes();
  const existing = notes.findIndex((n) => n.blockId === blockId);

  const note: BlockNote = {
    blockId,
    subjectCode,
    content,
    createdAt: existing >= 0 ? notes[existing].createdAt : new Date().toISOString(),
    edited: existing >= 0,
  };

  if (existing >= 0) {
    notes[existing] = note;
  } else {
    notes.push(note);
  }

  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function searchNotes(query: string): BlockNote[] {
  const notes = getBlockNotes();
  const lowerQuery = query.toLowerCase();
  return notes.filter((note) =>
    note.content.toLowerCase().includes(lowerQuery)
  );
}