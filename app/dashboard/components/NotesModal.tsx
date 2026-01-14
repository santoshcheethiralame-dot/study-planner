"use client";

import { useState, useEffect } from "react";
import { saveBlockNote } from "@/lib/notes";

interface NotesModalProps {
    blockId: string;
    subjectCode: string;
    initialNote?: string;
    onClose: () => void;
}

export function NotesModal({ blockId, subjectCode, initialNote = "", onClose }: NotesModalProps) {
    const [content, setContent] = useState(initialNote);
    const charCount = content.length;
    const maxChars = 500;

    const handleSave = () => {
        if (content.trim()) {
            saveBlockNote(blockId, subjectCode, content.trim());
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Add Notes</h3>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
                    placeholder="What did you learn? Any key insights?"
                    className="w-full h-40 p-4 border border-neutral-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />

                <div className="flex items-center justify-between mt-4">
                    <span className={`text-sm ${charCount > 480 ? "text-red-500" : "text-neutral-500"}`}>
                        {charCount}/{maxChars}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Save Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}