import { supabase } from "./supabase";
import type { Task, NewTask, Status } from "./types";

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Task[];
}

export async function addTask(input: NewTask): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title,
      description: input.description ?? null,
      assignee: input.assignee ?? null,
      priority: input.priority ?? "common",
      due_date: input.due_date ?? null,
      status: input.status ?? "todo",
      position: Date.now(),
    })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function patchTask(id: string, patch: Partial<Task>): Promise<void> {
  const { error } = await supabase.from("tasks").update(patch).eq("id", id);
  if (error) throw error;
}

export async function moveTask(id: string, status: Status): Promise<void> {
  return patchTask(id, { status, position: Date.now() });
}

export async function removeTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}
