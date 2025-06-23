import { z } from 'zod';

export const baseProjectSchema = {
  name: z.string().min(1, "프로젝트 이름이 비어있습니다."),
  client: z.string(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "날짜 값이 유효하지 않습니다." }),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "날짜 값이 유효하지 않습니다." }),
  leader: z.string(),
  client_assignee: z.string(),
  histories: z.array(z.string()).optional(),
  // color: z.number().int().nonnegative(),
};

export const createProjectSchema = z.object(baseProjectSchema);
// export const createProjectSchema = z.object({
//   ...baseProjectSchema,
//   color: baseProjectSchema.color.optional(), // color만 optional (X)
// });

export const updateProjectSchema = z.object({
  ...Object.fromEntries(
    Object.entries(baseProjectSchema).map(([key, val])=>[key, val.optional()])
  )
});

export const projectIdParamSchema = z.object({
  id: z.coerce.number().int().nonnegative()
});