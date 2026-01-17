type Handler<T = unknown> = (
  req: Request,
  context?: unknown
) => Promise<T>;

export function withLogging<T>(handler: Handler<T>): Handler<T> {
  return async (req, context) => {
    const start = Date.now();

    try {
      return await handler(req, context);
    } finally {
      const duration = Date.now() - start;
      console.log(
        `[API] ${req.method} ${new URL(req.url).pathname} - ${duration}ms`
      );
    }
  };
}
