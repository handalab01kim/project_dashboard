import pool from "../../config/pool";
import Task from "./task.dto";
import repositoryErrorCatcher from "../../util/repository-error-catcher";
import HttpError, {CommonError} from "../../errors/http-error";

async function getTasksByWeek({start, end}:{start:string,end:string}): Promise<Task[]> {
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
            from (select task.*, assignee.name assignee from task join assignee on task.assignee_id = assignee.idx) t 
            join project p
            on t.project_id = p.idx
            where t.end_date >=$1 AND t.start_date - interval '1 day' <$2 
            order by t.idx
            ;`, [start, end]);
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
            from (select task.*, assignee.name assignee from task join assignee on task.assignee_id = assignee.idx) t 
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

async function getValidAssigneeIdx(assigneeName?:string): Promise<string>{
    if(!assigneeName) throw new HttpError(CommonError.BAD_REQUEST, "Invalid assignee (undefined)");
    const assignee_result = await pool.query(`select a.idx from assignee a where a.name = $1`, [assigneeName]);
    if(assignee_result.rows.length===0){
        throw new HttpError(CommonError.BAD_REQUEST, "Invalid assignee");
    } // 존재하지 않는 담당자 이름
    return assignee_result.rows[0].idx;
}

async function createTask(dto: Task): Promise<Task> {

    try {
        const assigneeIdx = await getValidAssigneeIdx(dto.assignee);

        const values = [
            dto.name,
            dto.step,
            assigneeIdx,
            dto.start_date,
            dto.end_date,
            dto.content,
            dto.project  // project name
        ];

        const result = await pool.query(`
            INSERT INTO task (name,
                              step,
                              assignee_id,
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
            } else if (key === "assignee"){
                await getValidAssigneeIdx(value);

                // assignee name → assignee_id
                setClauseParts.push(`assignee_id = (SELECT idx FROM assignee WHERE name = $${idx})`);
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

async function deleteTask(id: number): Promise<Task> {
    try {
        const query = `
            DELETE FROM task
            WHERE idx = $1
            RETURNING *
        `;

        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function getAssignees(): Promise<string[]>{
    try{
        const result = await pool.query(`select * from assignee`);
        return result.rows.map(a=>a.name);
    }catch(e){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}


export default {
    getTasksByWeek,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getAssignees,
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