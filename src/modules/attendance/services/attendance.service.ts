// Attendance service is now a thin re-export.
// All data fetching is handled by the React Query hooks in attendance.api.ts.
// This file is kept for backward compatibility with any remaining imports.
export * from "./attendance.api";
