# Project X — Feature Progress

## Authentication

- [x] User registration
- [x] User login
- [x] JWT-based auth with protected routes
- [x] Persistent auth state (Zustand)

---

## Projects

- [x] List all projects with pagination
- [x] Search projects by title
- [x] Filter by status (Active / Completed / On Hold / Cancelled)
- [x] Sort by created date, updated date, title, progress
- [x] Active / Archived tabs
- [x] Create project (title, description, color picker)
- [x] Edit project (title, description, color, status)
- [x] Archive / unarchive project
- [x] Delete project
- [x] Project progress bar (completed goals / total goals)
- [x] Project card with goal count and color indicator

---

## Goals

- [x] List goals per project
- [x] Create goal (title, description, due date, recurrence)
- [x] Edit goal (inline title, description, due date, recurrence)
- [x] Mark goal as complete / incomplete
- [x] Delete goal
- [x] Drag-and-drop reorder goals
- [x] Clear all completed goals
- [x] Recurring goals (Daily / Weekly / Monthly) — creates next occurrence on completion
- [x] Due date display on goal items

---

## Calendar

- [x] Month grid view (desktop)
- [x] Week strip view (mobile)
- [x] Goals displayed on their due dates
- [x] Click a day to see goal detail panel
- [x] Add goal from calendar (pre-fills due date)
- [x] Goal chips colored by project

---

## Pomodoro

- [x] Circular progress ring (color changes per mode)
- [x] Three modes: Focus / Short Break / Long Break
- [x] Start, Pause, Reset controls
- [x] Auto-advance to next mode on completion
- [x] Sound notification on completion (Web Audio API)
- [x] Browser tab title shows countdown while running
- [x] Settings panel (focus/break durations, long break interval, auto-start toggles)
- [x] Settings persisted to localStorage
- [x] Custom project dropdown (link session to a project)
- [x] Sessions saved to database on start and completion
- [x] Stats panel (today / this week / this month)
  - [x] Total sessions and minutes focused
  - [x] Breakdown by project with relative bar chart
  - [x] Auto-refreshes after each completed session

---

## Dashboard

- [ ] Overview stats (total projects, goals completed, pomodoro minutes)
- [ ] Recent activity feed
- [ ] Upcoming due dates widget
- [ ] Weekly focus time chart

---

## UI / UX

- [x] Responsive layout (mobile sidebar, desktop collapsed/expanded)
- [x] Dark / Light / System theme toggle
- [x] Custom reusable Modal component
- [x] Confirm dialog for destructive actions
- [x] Loading skeletons
- [x] Toast notifications (React Hot Toast)
- [x] Hover/transition animations throughout
