import pool from "../../config/pool";
import Task from "./task.model";
import repositoryErrorCatcher from "../../util/repository-error-catcher";

async function getTasks():Promise<Task[]>{
    try{
        const result = await pool.query(`
            select 
                t.idx,
                t.name,
                t.step,
                --t.assignee,
                --t.project_id,
                p.name project
            from 
                task t
            join
                project p
            on
                t.project_id = p.idx;`);
        return result.rows;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function getAssignees(task_id:number):Promise<string[]>{
    try{
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


export default {
    getTasks,
    getAssignees,
};