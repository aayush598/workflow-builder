/**
 * Global store entry point.
 *
 * This file exists to:
 * - Provide a single import surface for state
 * - Prevent circular imports
 * - Make future refactors (Redux, Jotai, server state) trivial
 *
 * IMPORTANT:
 * - No logic
 * - No Zustand create calls
 * - No side effects
 */

/* ------------------------------------------------------------------ */
/* Workflow graph (nodes + edges) */
/* ------------------------------------------------------------------ */

export { default as useWorkflowStore } from './workflow.store';

/* ------------------------------------------------------------------ */
/* Execution state (running nodes, status, outputs) */
/* ------------------------------------------------------------------ */

export { default as useExecutionStore } from './execution.store';

/* ------------------------------------------------------------------ */
/* History (immutable workflow runs) */
/* ------------------------------------------------------------------ */

export { default as useHistoryStore } from './history.store';
