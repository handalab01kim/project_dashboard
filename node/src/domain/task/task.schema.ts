import { z } from "zod";

// 공통 필드
const baseTaskSchema = {
    name: z.string().min(1, "name은 필수입니다."),
    // step: z.union([z.string(), z.number()]),
    step: z.string(),
    assignee: z.string(),
    start_date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "유효한 날짜여야 합니다." }),
    end_date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "유효한 날짜여야 합니다." }),
    // project: z.union([z.string(), z.number()]),
    project: z.string(),
    content: z.string().optional(),
};

// create - 모든 필드 필수
export const createTaskSchema = z.object(baseTaskSchema);

// update - 모든 필드 선택적
export const updateTaskSchema = z.object({
    ...Object.fromEntries(
        Object.entries(baseTaskSchema).map(([key, val]) => [key, val.optional()])
    )
});

// // delete - 숫자 or 숫자 배열
// export const deleteTaskSchema = z.object({
//     id: z.union([
//         z.number().int("정수여야 합니다.").nonnegative("음수는 허용되지 않습니다."),
//         z.array(z.number().int().nonnegative())
//     ])
// });

export const taskIdParamSchema = z.object({
    id: z.coerce.number().int().nonnegative()
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
