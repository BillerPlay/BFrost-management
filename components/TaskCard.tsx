"use client";

import { Task, Status, COLUMNS, avatarFor } from "@/lib/types";

const ORDER: Status[] = ["todo", "doing", "done"];

function dueMeta(due: string | null): { label: string; overdue: boolean } | null {
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(due + "T00:00:00");
  const overdue = d < today;
  const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return { label, overdue };
}

export default function TaskCard({
  task,
  victory,
  onMove,
  onDelete,
}: {
  task: Task;
  victory: boolean;
  onMove: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}) {
  const idx = ORDER.indexOf(task.status);
  const due = dueMeta(task.due_date);

  return (
    <article
      className={`quest${victory ? " victory" : ""}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.classList.add("dragging");
      }}
      onDragEnd={(e) => e.currentTarget.classList.remove("dragging")}
    >
      <span className={`rarity ${task.priority}`} aria-hidden />
      <div className="quest-body">
        <div className="quest-top">
          <h3 className="quest-title">{task.title}</h3>
          <button
            className="quest-del"
            aria-label={`Delete quest: ${task.title}`}
            onClick={() => onDelete(task.id)}
          >
            ×
          </button>
        </div>

        {task.description ? (
          <p className="quest-desc">{task.description}</p>
        ) : null}

        <div className="quest-foot">
          {task.assignee ? (
            <span className="avatar">
              <span className="face" aria-hidden>
                {avatarFor(task.assignee)}
              </span>
              {task.assignee}
            </span>
          ) : (
            <span className="avatar unassigned">
              <span className="face" aria-hidden>
                ?
              </span>
              Unclaimed
            </span>
          )}

          {due ? (
            <span className={`deadline${due.overdue ? " overdue" : ""}`}>
              {due.overdue ? "⌛ " : ""}
              {due.label}
            </span>
          ) : null}

          <span className={`rarity-pill ${task.priority}`}>{task.priority}</span>

          <span className="movers">
            <button
              className="mover"
              aria-label="Move to previous column"
              disabled={idx === 0}
              onClick={() => onMove(task.id, ORDER[idx - 1])}
            >
              ◀
            </button>
            <button
              className="mover"
              aria-label="Move to next column"
              disabled={idx === ORDER.length - 1}
              onClick={() => onMove(task.id, ORDER[idx + 1])}
            >
              ▶
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}

export { COLUMNS };
