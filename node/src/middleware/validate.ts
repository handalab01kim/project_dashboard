import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import HttpError from '../types/http-error';

export const validate = (schema: ZodSchema<any>, target: "body" | "params" | "query" = "body") => 
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
    //   return res.status(400).json({ error: result.error.errors });
      return next(new HttpError(400, "Bad Request", `Error: ${JSON.stringify(result.error?.errors)}`));
    }
    req[target] = result.data;
    next();
};

// export const validateCombined = (schema: ZodSchema<any>) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     const combined = { query: req.query, body: req.body };
//     const result = schema.safeParse(combined);
//     if (!result.success) {
//       return next(new HttpError(400, "Bad Request", JSON.stringify(result.error.issues)));
//     }
//     req.query = result.data.query;
//     req.body = result.data.body;
//     next();
//   };

/////

// const combinedSchema = z.object({
//   query: querySchema,
//   body: bodySchema,
// });
