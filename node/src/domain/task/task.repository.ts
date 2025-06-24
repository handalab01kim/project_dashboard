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
                   --t.assignee,
                   --t.project_id,
                   t.start_date,
                   t.end_date,
                   p.name project,
                   t.content
            from task t 
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
                   --t.assignee,
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

async function getValidAssigneeIdx(assigneeName?:string[]): Promise<number[]>{
    if(!assigneeName) throw new HttpError(CommonError.BAD_REQUEST, "Invalid assignee (undefined)");
    if(assigneeName.length==0) return [];
    const whereClause = Object.keys(assigneeName)
        .map((key, idx)=> `$${idx+1}`)
        .join(",");
    const assignee_result = await pool.query(
        `select a.idx from assignee a where a.name in (${whereClause})`
        , [...assigneeName]);
    if(assignee_result.rows.length===0){
        throw new HttpError(CommonError.BAD_REQUEST, "Invalid assignee");
    } // 존재하지 않는 담당자 이름
    if(assigneeName.length!==assignee_result.rows.length){
        throw new HttpError(CommonError.BAD_REQUEST, "Invalid assignee");
    }
    return assignee_result.rows.map((r)=>r.idx);
}

    async function createTask(dto: Task): Promise<Task> {

        try {
            const assigneeIdx:number[] = await getValidAssigneeIdx(dto.assignee);
            if(dto.assignee?.length!==assigneeIdx.length){ // 중복 코드
                throw new HttpError(CommonError.BAD_REQUEST, "Invalid assignee");
            }

            const values = [
                dto.name,
                dto.step,
                dto.start_date,
                dto.end_date,
                dto.content,
                dto.project  // project name
            ];
            const result1 = await pool.query(`
                INSERT INTO task (name,
                                step,
                                start_date,
                                end_date,
                                content,
                                project_id)
                SELECT $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    p.idx
                FROM project p
                WHERE p.name = $6 returning *`, values);
            if(result1.rows.length===0){
                throw new HttpError(CommonError.INTERNAL_SERVER_ERROR, "task 삽입 실패 !!");
            }

            await createTaskAssigneeForTask(result1.rows[0].idx, assigneeIdx);
            // const whereClause = Object.keys(dto.assignee)
            //     .map((key, idx)=> `($1, $${idx+2})`)
            //     .join(",");
            // const result2 = await pool.query(`
            //     INSERT INTO task_assignee(task_id, assignee_id)
            //     VALUES ${whereClause}
            //     RETURNING *;
            //     `, [result1.rows[0].idx, ...dto.assignee]);

            const result = {...result1, assignee:dto.assignee}
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
                const assigneeIndexes:number[] = await getValidAssigneeIdx(value);
                await deleteTaskAssigneesForTask(id);
                await createTaskAssigneeForTask(id, assigneeIndexes);
                idx--;
                // assignee name → assignee_id
                // setClauseParts.push(`assignee_id = (SELECT idx FROM assignee WHERE name = $${idx})`);
                // values.push(value);
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

async function getAssigneesForTask(task_id?:number):Promise<string[]>{
    try{
        if(!task_id) throw new HttpError(CommonError.INTERNAL_SERVER_ERROR, "task_id not found!!");
        const result = await pool.query(`
            select
            --     a.idx,
                a.name
            from
                task_assignee t
            join
                assignee a
            on
                t.assignee_id = a.idx
            where
                t.task_id = $1
            -- order by
            --     a.idx ASC
                `, [task_id]);
        return result.rows.map(q=>q.name);
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
};
async function createTaskAssigneeForTask(task_id:number, assigneeindexes:number[]):Promise<void>{
    try{
        if(assigneeindexes.length==0) return;
        const whereClause = Object.keys(assigneeindexes)
            .map((key, idx)=> `($1, $${idx+2})`)
            .join(",");

        await pool.query(`
            INSERT INTO task_assignee(task_id, assignee_id)
            VALUES ${whereClause}
            RETURNING *;
            `, [task_id, ...assigneeindexes]);

    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function deleteTaskAssigneesForTask(task_id?:number):Promise<void>{
    try{
        if(!task_id) throw new HttpError(CommonError.INTERNAL_SERVER_ERROR, "task_id not found!!");
        await pool.query(`
            delete from task_assignee
            where task_id = $1;
        `, [task_id]);
    }catch(e:any){
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
    getAssigneesForTask,
};


