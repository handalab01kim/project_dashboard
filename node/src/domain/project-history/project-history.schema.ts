import {z} from "zod";

export const idParamSchema = z.object({
   id: z.coerce.number().int().nonnegative()
});
export const projectNameParamSchema = z.object({
    project: z.string()
});
export const contentHistorySchema = z.object({
    content: z.string()
});