"use client";

import { useState } from "react";

export function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: "?", description: "Show this help" },
    { key: "d", description: "Go to Dashboard" },
    { key: "p", description: "Go to Planner" },
    { key: "s", description: "Go to Stats" },
    { key: "g", description: "Go to Settings" },
    { key: "n", description: "Add new block" },
    { key: "Esc", description: "Close modals" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-white border-2 border-neutral-300 text-neutral-700 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center font-bold text-lg z-50"
        title="Keyboard Shortcuts"
      >
        ?
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">⌨️ Keyboard Shortcuts</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-neutral-600">{shortcut.description}</span>
                  <kbd className="px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-lg text-sm font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}