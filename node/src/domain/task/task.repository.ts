import pool from "../../config/pool";
import Task from "./task.dto";
import repositoryErrorCatcher from "../../util/repository-error-catcher";
import HttpError, {CommonError} from "../../errors/http-error";

async function getAllTasks(): Promise<Task[]> {
    try {
        const result = await pool.query(`
            select t.idx,
                   t.name,
                   t.step,
                   t.assignee,
                   --t.project_id,
                   t.start_date,
                   t.end_date,
                   p.name project,
                   t.content
            from task t
                     join
                 project p
                 on
                     t.project_id = p.idx;`);
        return result.rows;
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function getTask(id: number): Promise<Task> {
    try {
        const result = await pool.query(`
            select t.idx,
                   t.name,
                   t.step,
                   t.assignee,
                   --t.project_id,
                   p.name project,
                   t.content
            from task t
                     join
                 project p
                 on
                     t.project_id = p.idx
            where t.idx = $1`, [id]);
        return result.rows[0];
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function createTask(dto: Task): Promise<Task> {

    const values = [
        dto.name,
        dto.step,
        dto.assignee,
        dto.start_date,
        dto.end_date,
        dto.content,
        dto.project  // project name
    ];
    try {
        const result = await pool.query(`
            INSERT INTO task (name,
                              step,
                              assignee,
                              start_date,
                              end_date,
                              content,
                              project_id)
            SELECT $1,
                   $2,
                   $3,
                   $4,
                   $5,
                   $6,
                   p.idx
            FROM project p
            WHERE p.name = $7 returning *`, values);
        return result.rows[0];
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function updateTask(id: number, task: Task): Promise<Task> {
    try {
        if (Object.keys(task).length === 0) {
            return await getTask(id);
        } // 변경 X

        const values: any[] = [id];
        const setClauseParts: string[] = [];
        let idx = 2;

        for (const [key, value] of Object.entries(task)) {
            if (key === "project") {
                // project name → project_id
                setClauseParts.push(`project_id = (SELECT idx FROM project WHERE name = $${idx})`);
                values.push(value);
            } else {
                // 일반 필드
                setClauseParts.push(`${key} = $${idx}`);
                values.push(value);
            }
            idx++;
        }

        const setClause = setClauseParts.join(", ");

        const query = `
            UPDATE task
            SET ${setClause}
            WHERE idx = $1
            RETURNING *
        `;

        const result = await pool.query(query, values);
        return result.rows[0];

    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function deleteTask(idx: number | number[]): Promise<Task[]> {
    try {
        // 입력을 배열로 통일
        const ids = Array.isArray(idx) ? idx : [idx];

        if (ids.length === 0) {
            throw new HttpError(CommonError.BAD_REQUEST, "no indexes received");
        }

        // IN ($1, $2, ...) 쿼리 구성
        const inClause = ids.map((_, i) => `$${i + 1}`).join(", ");
        const query = `
            DELETE FROM task
            WHERE idx IN (${inClause})
            RETURNING *
        `;

        const result = await pool.query(query, ids);
        return result.rows;
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}


export default {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    // getAssignees,
};


// async function getAssignees(task_id:number):Promise<string[]>{
//     try{
//         const result = await pool.query(`
//             select
//             --     a.idx,
//                 a.name
//             from
//                 task_assignee t
//             join
//                 assignee a
//             on
//                 t.assignee_id = a.idx
//             where
//                 t.task_id = $1
//             -- order by
//             --     a.idx ASC
//                 `, [task_id]);
//         return result.rows.map(q=>q.name);
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// };