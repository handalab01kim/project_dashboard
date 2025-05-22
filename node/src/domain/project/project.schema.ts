import { z } from 'zod';

// export type ChannelInfo = z.infer<typeof channelInfoSchema>;
// export const projectSchema = z.object({
//   week: z.coerce.number().optional().nullable(), // query / param?
//   // week: z.number(), // body
// });

export const baseProjectSchema = {
  name: z.string().min(1, "프로젝트 이름이 비어있습니다."),
  client: z.string(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "날짜 값이 유효하지 않습니다." }),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "날짜 값이 유효하지 않습니다." }),
};

export const createProjectSchema = z.object(baseProjectSchema);

export const updateProjectSchema = z.object({
  ...Object.fromEntries(
    Object.entries(baseProjectSchema).map(([key, val])=>[key, val.optional()])
  )
});

export const projectIdParamSchema = z.object({
  id: z.coerce.number().int().nonnegative()
});