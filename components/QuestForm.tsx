"use client";

import { useState } from "react";
import { NewTask, Priority, PARTY, PRIORITIES } from "@/lib/types";

export default function QuestForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (t: NewTask) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("common");
  const [due, setDue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onSubmit({
      title: t,
      description: description.trim() || undefined,
      assignee: assignee || null,
      priority,
      due_date: due || null,
    });
  }

  return (
    <div
      className="scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="sheet" onSubmit={submit}>
        <h2>New quest</h2>

        <label className="field">
          <span>Quest name</span>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Wire up the login page"
            maxLength={120}
          />
        </label>

        <label className="field">
          <span>Details (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does done look like?"
          />
        </label>

        <div className="row">
          <label className="field">
            <span>Owner</span>
            <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
              <option value="">Unclaimed</option>
              {PARTY.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.avatar} {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Rarity</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Deadline (optional)</span>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>

        <div className="sheet-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Add quest
          </button>
        </div>
      </form>
    </div>
  );
}
