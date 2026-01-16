/**
 * Zod schemas for node data validation.
 *
 * Responsibilities:
 * - Define the shape of `node.data` for every node type
 * - Provide runtime safety for execution & persistence
 * - Enable safe import/export of workflows
 *
 * IMPORTANT:
 * - No UI logic
 * - No React Flow types
 * - No execution logic
 */

import { z } from 'zod';
import type { NodeTypeId } from './node-types';

/* ------------------------------------------------------------------ */
/* Base Schema */
/* ------------------------------------------------------------------ */

const BaseNodeDataSchema = z.object({
  label: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/* Individual Node Schemas */
/* ------------------------------------------------------------------ */

export const TextNodeSchema = BaseNodeDataSchema.extend({
  text: z.string().default(''),
});

export const UploadImageNodeSchema = BaseNodeDataSchema.extend({
  imageUrl: z.string().url().optional(),
  fileName: z.string().optional(),
});

export const UploadVideoNodeSchema = BaseNodeDataSchema.extend({
  videoUrl: z.string().url().optional(),
  fileName: z.string().optional(),
});

export const CropImageNodeSchema = BaseNodeDataSchema.extend({
  xPercent: z.union([z.number(), z.string()]).default(0),
  yPercent: z.union([z.number(), z.string()]).default(0),
  widthPercent: z.union([z.number(), z.string()]).default(100),
  heightPercent: z.union([z.number(), z.string()]).default(100),
});

export const ExtractFrameNodeSchema = BaseNodeDataSchema.extend({
  timestamp: z.union([z.number(), z.string()]).default(0),
});

export const LLMNodeSchema = BaseNodeDataSchema.extend({
  model: z.string().default('gemini-2.0-flash'),
  result: z.string().optional(),
});

/* ------------------------------------------------------------------ */
/* Schema Registry (IMPORTANT PART) */
/* ------------------------------------------------------------------ */

/**
 * IMPORTANT:
 * Use `ZodTypeAny` so `.parse()` returns a concrete inferred type,
 * not `unknown`.
 */
export const NODE_DATA_SCHEMAS = {
  text: TextNodeSchema,
  'upload-image': UploadImageNodeSchema,
  'upload-video': UploadVideoNodeSchema,
  'crop-image': CropImageNodeSchema,
  'extract-frame': ExtractFrameNodeSchema,
  llm: LLMNodeSchema,
} satisfies Record<NodeTypeId, z.ZodTypeAny>;

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

/**
 * Parse and sanitize node data safely.
 * Always use this before execution or persistence.
 */
export function parseNodeData<T>(
  nodeType: NodeTypeId,
  data: unknown
): T {
  return NODE_DATA_SCHEMAS[nodeType].parse(data) as T;
}

/**
 * Get default node data for a given node type.
 *
 * NOTE:
 * We intentionally widen the return type here because
 * DomainNode.data is framework-agnostic.
 */
export function getDefaultNodeData(
  nodeType: NodeTypeId
): Record<string, unknown> {
  return NODE_DATA_SCHEMAS[nodeType].parse({}) as Record<string, unknown>;
}
