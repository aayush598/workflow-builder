/**
 * Trigger service (mock implementation).
 *
 * Responsibilities:
 * - Represent async / background triggers
 * - Simulate delayed execution and webhooks
 * - Act as a boundary for future automation systems
 *
 * FUTURE:
 * - Replace with Trigger.dev
 * - Temporal
 * - Serverless queues / cron jobs
 *
 * IMPORTANT:
 * - No React
 * - No Zustand
 * - No DOM APIs
 */

import { nanoid } from 'nanoid';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type TriggerType =
  | 'manual'
  | 'schedule'
  | 'webhook';

export interface TriggerResult {
  triggerId: string;
  status: 'scheduled' | 'completed';
  scheduledAt: string;
}

export interface TriggerOptions {
  delayMs?: number;
  metadata?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------ */
/* Triggers */
/* ------------------------------------------------------------------ */

/**
 * Fire a trigger.
 *
 * This simulates a background job that eventually
 * causes a workflow execution.
 */
export async function fireTrigger(
  type: TriggerType,
  options: TriggerOptions = {}
): Promise<TriggerResult> {
  const triggerId = nanoid();
  const scheduledAt = new Date().toISOString();

  // Simulate scheduling delay
  if (options.delayMs) {
    await sleep(options.delayMs);
  }

  return {
    triggerId,
    status: 'scheduled',
    scheduledAt,
  };
}

/**
 * Simulate trigger completion.
 *
 * In a real system, this would be invoked by
 * a webhook or background worker.
 */
export async function completeTrigger(
  triggerId: string
): Promise<{ triggerId: string; completedAt: string }> {
  await sleep(500 + Math.random() * 500);

  return {
    triggerId,
    completedAt: new Date().toISOString(),
  };
}
