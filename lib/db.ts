import { supabase, isSupabaseConfigured } from "./supabase";
import type { Task, NewTask, Status } from "./types";

// One data layer, two backends:
//  - Supabase (Postgres) when env keys are present.
//  - localStorage when they are not, so the board runs the moment you clone it.
// Both persist across refresh, satisfying the lab's "tasks survive a refresh" rule.

const LS_KEY = "quest-board-tasks-v1";

function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

function readLocal(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(tasks: Task[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}

export async function fetchTasks(): Promise<Task[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as Task[];
  }
  return readLocal().sort((a, b) => a.position - b.position);
}

export async function addTask(input: NewTask): Promise<Task> {
  const base = {
    title: input.title,
    description: input.description ?? null,
    assignee: input.assignee ?? null,
    priority: input.priority ?? "common",
    due_date: input.due_date ?? null,
    status: input.status ?? "todo",
    position: Date.now(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("tasks")
      .insert(base)
      .select()
      .single();
    if (error) throw error;
    return data as Task;
  }

  const task: Task = { ...base, id: uid(), created_at: new Date().toISOString() };
  const tasks = readLocal();
  tasks.push(task);
  writeLocal(tasks);
  return task;
}

export async function patchTask(id: string, patch: Partial<Task>): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("tasks").update(patch).eq("id", id);
    if (error) throw error;
    return;
  }
  const tasks = readLocal().map((t) => (t.id === id ? { ...t, ...patch } : t));
  writeLocal(tasks);
}

export async function moveTask(id: string, status: Status): Promise<void> {
  return patchTask(id, { status, position: Date.now() });
}

export async function removeTask(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  writeLocal(readLocal().filter((t) => t.id !== id));
}
