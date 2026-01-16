/**
 * LLM service (mock implementation).
 *
 * Responsibilities:
 * - Accept structured LLM execution requests
 * - Simulate latency, errors, and outputs
 * - Return deterministic, debuggable results
 *
 * FUTURE:
 * - Replace internals with Trigger.dev + Gemini
 * - Keep function signature identical
 *
 * IMPORTANT:
 * - No React
 * - No Zustand
 * - No Trigger.dev imports (yet)
 */

import type { NodeTypeId } from '@/domain/nodes/node-types';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface LLMImageInput {
  url: string;
}

export interface LLMRequest {
  /** Node id for tracing */
  nodeId: string;

  /** Selected model */
  model: string;

  /** Optional system instructions */
  systemPrompt?: string;

  /** User prompt (required) */
  userMessage: string;

  /** Optional multimodal images */
  images?: LLMImageInput[];
}

export interface LLMResponse {
  output: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
  };
}

/* ------------------------------------------------------------------ */
/* Mock Helpers */
/* ------------------------------------------------------------------ */

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateMockResponse(req: LLMRequest): string {
  const imageInfo =
    req.images && req.images.length > 0
      ? `\n\n🖼️ Images provided: ${req.images.length}`
      : '';

  return `
✨ Generated Response (${req.model})

${req.systemPrompt ? `SYSTEM:\n${req.systemPrompt}\n\n` : ''}USER:
${req.userMessage}

${imageInfo}

This is a mock LLM response.
Replace llm.service.ts with Gemini + Trigger.dev to enable real execution.
`.trim();
}

/* ------------------------------------------------------------------ */
/* Public API */
/* ------------------------------------------------------------------ */

/**
 * Execute an LLM request.
 *
 * This function intentionally mirrors what a Trigger.dev task
 * will look like later.
 */
export async function runLLM(
  request: LLMRequest
): Promise<LLMResponse> {
  // Simulate network + inference latency
  await sleep(2000 + Math.random() * 1500);

  // Simulate occasional failure (10%)
  if (Math.random() < 0.1) {
    throw new Error('Mock LLM execution failed');
  }

  return {
    output: generateMockResponse(request),
    usage: {
      promptTokens: Math.floor(Math.random() * 500) + 50,
      completionTokens: Math.floor(Math.random() * 300) + 50,
    },
  };
}
/**
 * Media service (mock implementation).
 *
 * Responsibilities:
 * - Handle image & video related operations
 * - Simulate uploads and processing
 * - Provide deterministic mock outputs
 *
 * FUTURE:
 * - Replace internals with:
 *   - S3 / R2 / UploadThing for uploads
 *   - FFmpeg / Transloadit for processing
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

export interface UploadResult {
  url: string;
  fileName: string;
}

export interface CropImageRequest {
  imageUrl: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

export interface ExtractFrameRequest {
  videoUrl: string;
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

// sleep is already defined above

function randomFail(probability = 0.05) {
  if (Math.random() < probability) {
    throw new Error('Mock media processing failed');
  }
}

function mockImageUrl(label: string) {
  return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&sig=${label}-${nanoid(
    6
  )}`;
}

function mockVideoUrl() {
  return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
}

/* ------------------------------------------------------------------ */
/* Uploads */
/* ------------------------------------------------------------------ */

/**
 * Mock image upload.
 */
export async function uploadImage(
  fileName = 'image.jpg'
): Promise<UploadResult> {
  await sleep(800 + Math.random() * 800);
  randomFail();

  return {
    fileName,
    url: mockImageUrl('upload'),
  };
}

/**
 * Mock video upload.
 */
export async function uploadVideo(
  fileName = 'video.mp4'
): Promise<UploadResult> {
  await sleep(1200 + Math.random() * 1000);
  randomFail();

  return {
    fileName,
    url: mockVideoUrl(),
  };
}

/* ------------------------------------------------------------------ */
/* Image Processing */
/* ------------------------------------------------------------------ */

/**
 * Crop an image.
 */
export async function cropImage(
  request: CropImageRequest
): Promise<{ url: string }> {
  await sleep(1000 + Math.random() * 1000);
  randomFail();

  return {
    url: mockImageUrl(
      `crop-${request.xPercent}-${request.yPercent}`
    ),
  };
}

/* ------------------------------------------------------------------ */
/* Video Processing */
/* ------------------------------------------------------------------ */

/**
 * Extract a single frame from a video.
 */
export async function extractFrame(
  request: ExtractFrameRequest
): Promise<{ url: string }> {
  await sleep(1500 + Math.random() * 1200);
  randomFail();

  return {
    url: mockImageUrl(`frame-${request.timestamp}`),
  };
}
