export type Status = "todo" | "doing" | "done";

// Priority doubles as item rarity — the colored strip on each quest card.
export type Priority = "common" | "rare" | "epic" | "legendary";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  assignee: string | null; // party member name, see PARTY below
  priority: Priority;
  due_date: string | null; // ISO date (yyyy-mm-dd)
  status: Status;
  position: number; // order within a column
  created_at: string;
};

export type NewTask = {
  title: string;
  description?: string;
  assignee?: string | null;
  priority?: Priority;
  due_date?: string | null;
  status?: Status;
};

export const COLUMNS: { status: Status; name: string; sub: string }[] = [
  { status: "todo", name: "Quest Log", sub: "not started" },
  { status: "doing", name: "In Battle", sub: "in progress" },
  { status: "done", name: "Cleared", sub: "complete" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "common", label: "Common" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

// The party. Edit this list to match your real team — name + emoji avatar.
export const PARTY: { name: string; avatar: string }[] = [
  { name: "Ayhan", avatar: "🦊" },
  { name: "Islam", avatar: "🐲" },
  { name: "Qurban", avatar: "🐺" },
  { name: "Yunis", avatar: "🦁" },
  { name: "Abdulvahab", avatar: "🐻" },
];

export function avatarFor(name: string | null): string {
  if (!name) return "✦";
  return PARTY.find((p) => p.name === name)?.avatar ?? name.charAt(0).toUpperCase();
}
