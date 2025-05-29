import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import HttpError, {CommonError} from '../errors/http-error';

export const validate = (schema: ZodSchema<any>, target: "body" | "params" | "query" = "body") => 
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
        const zodError = result.error as ZodError;

        // 에러 메시지 생성
        const errorMessage = zodError.errors
            // .map((err) => `${err.message}`)
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", "); // 여러 개면 쉼표로 연결

        return next(
            new HttpError(CommonError.BAD_REQUEST_TYPE, errorMessage)
        );
    //   return next(new HttpError(CommonError.BAD_REQUEST_TYPE, `Error: ${JSON.stringify(result.error?.errors)}`));
    }
    req[target] = result.data;
    next();
};
