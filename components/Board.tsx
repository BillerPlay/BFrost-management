"use client";

import { useEffect, useState } from "react";
import { Task, Status, NewTask, COLUMNS } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchTasks, addTask, moveTask, removeTask } from "@/lib/db";
import TaskCard from "./TaskCard";
import QuestForm from "./QuestForm";
import Mascot from "./Mascot";

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [over, setOver] = useState<Status | null>(null);
  const [victories, setVictories] = useState<Set<string>>(new Set());
  const [cheerKey, setCheerKey] = useState(0);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(input: NewTask) {
    setFormOpen(false);
    const optimistic: Task = {
      id: "tmp-" + Date.now(),
      title: input.title,
      description: input.description ?? null,
      assignee: input.assignee ?? null,
      priority: input.priority ?? "common",
      due_date: input.due_date ?? null,
      status: input.status ?? "todo",
      position: Date.now(),
      created_at: new Date().toISOString(),
    };
    setTasks((t) => [...t, optimistic]);
    try {
      const saved = await addTask(input);
      setTasks((t) => t.map((x) => (x.id === optimistic.id ? saved : x)));
    } catch (e) {
      console.error(e);
      setTasks((t) => t.filter((x) => x.id !== optimistic.id));
    }
  }

  async function handleMove(id: string, status: Status) {
    const prev = tasks.find((t) => t.id === id);
    if (!prev || prev.status === status) return;
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, status } : x)));
    if (status === "done") {
      setCheerKey((k) => k + 1);
      setVictories((v) => new Set(v).add(id));
      setTimeout(() => {
        setVictories((v) => {
          const n = new Set(v);
          n.delete(id);
          return n;
        });
      }, 750);
    }
    try {
      await moveTask(id, status);
    } catch (e) {
      console.error(e);
      setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: prev.status } : x)));
    }
  }

  async function handleDelete(id: string) {
    const prev = tasks;
    setTasks((t) => t.filter((x) => x.id !== id));
    try {
      await removeTask(id);
    } catch (e) {
      console.error(e);
      setTasks(prev);
    }
  }

  const counts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
  const cleared = counts.done;
  const total = tasks.length;

  return (
    <main className="page">
      <header className="masthead">
        <div className="brand">
          <div className="crest" aria-hidden>
            ⚔️
          </div>
          <div>
            <p className="brand-eyebrow">Task Management</p>
            <h1 className="title">BFrost</h1>
            <p className="tagline">
              {total === 0
                ? "No quests yet — post the first one."
                : `${cleared} of ${total} quests cleared. Keep the party moving.`}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className={`status-tag ${isSupabaseConfigured ? "live" : "local"}`}>
            {isSupabaseConfigured ? "● SAVING TO SUPABASE" : "● LOCAL SAVE"}
          </span>
          <button className="new-quest" onClick={() => setFormOpen(true)}>
            + New quest
          </button>
        </div>
      </header>

      {loading ? (
        <p className="loading">Loading the quest log…</p>
      ) : (
        <section className="board" aria-label="Task board">
          {COLUMNS.map((col) => {
            const items = tasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className={`column${over === col.status ? " over" : ""}`}
                data-col={col.status}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (over !== col.status) setOver(col.status);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOver(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setOver(null);
                  const id = e.dataTransfer.getData("text/plain");
                  if (id) handleMove(id, col.status);
                }}
              >
                <div className="col-head">
                  <h2 className="col-name">{col.name}</h2>
                  <span className="col-count">{items.length}</span>
                </div>
                <div className="col-body">
                  {items.length === 0 ? (
                    <p className="col-empty">
                      {col.status === "todo"
                        ? "Drop a quest here to begin."
                        : col.status === "doing"
                        ? "Nothing in battle right now."
                        : "No victories yet — go clear something."}
                    </p>
                  ) : (
                    items.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        victory={victories.has(t.id)}
                        onMove={handleMove}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {formOpen ? (
        <QuestForm onSubmit={handleAdd} onClose={() => setFormOpen(false)} />
      ) : null}

      <Mascot cheerKey={cheerKey} />
    </main>
  );
}
