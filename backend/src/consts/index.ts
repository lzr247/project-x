export const VALID_PROJECT_STATUSES = ["ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"] as const;

export const PROJECTS_PAGE_DEFAULT_LIMIT = 20;
export const PROJECTS_PAGE_MAX_LIMIT = 100;
export const VALID_SORT_FIELDS = ["createdAt", "updatedAt", "title", "progress"] as const;
