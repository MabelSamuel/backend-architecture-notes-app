import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

// Generic request validation middleware. Pass a Zod schema for the body,
// and it validates req.body before the request ever reaches the controller.
export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = (result.error as ZodError).format();
      res.status(400).json({ error: { message: 'Invalid request body', details } });
      return;
    }

    req.body = result.data;
    next();
  };
}
