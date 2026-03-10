import type { ProjectStatus } from "../types";

export const PROJECT_STATUS_FILTERS: { label: string; value: ProjectStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "On Hold", value: "ON_HOLD" },
  { label: "Cancelled", value: "CANCELLED" },
];

export const PROJECTS_PAGE_LIMIT: number = 20;

export const PRESET_COLORS: string[] = [
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#84CC16", // Lime
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#64748B", // Slate
];

export const PROJECT_SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Newest first", value: "createdAt_desc" },
  { label: "Oldest first", value: "createdAt_asc" },
  { label: "Recently updated", value: "updatedAt_desc" },
  { label: "Name A→Z", value: "title_asc" },
  { label: "Name Z→A", value: "title_desc" },
  { label: "Progress (highest)", value: "progress_desc" },
  { label: "Progress (lowest)", value: "progress_asc" },
];

export const RECURRENCE_OPTIONS = ["DAILY", "WEEKLY", "MONTHLY"] as const;

export const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
