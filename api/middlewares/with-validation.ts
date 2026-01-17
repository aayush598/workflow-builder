import { ZodSchema } from 'zod';
import { ValidationError } from '@/api/errors/validation.error';

export type ValidatedHandler<TBody, TResponse> = (
  req: Request,
  validatedBody: TBody,
  context?: unknown
) => Promise<TResponse>;

export function withValidation<TBody, TResponse>(
  schema: ZodSchema<TBody>,
  handler: ValidatedHandler<TBody, TResponse>
) {
  return async (req: Request, context?: unknown): Promise<TResponse> => {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      body = undefined;
    }

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError(
        'Invalid request body',
        parsed.error.flatten()
      );
    }

    return handler(req, parsed.data, context);
  };
}
