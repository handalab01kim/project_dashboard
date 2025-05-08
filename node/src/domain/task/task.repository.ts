import pool from "../../config/pool";
import Task from "./task";
import repositoryErrorCatcher from "../../util/repository-error-catcher";



async function getTasks():Promise<Task[]>{
    try{
        const result = await pool.query(`
            select 
                t.id,
                t.name,
                t.step,
                t.assignee,
                --t.project_id,
                p.name project
            from 
                task t
            join
                project p
            on
                t.project_id = p.id;`);
        return result.rows;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}


export default {
    getTasks,
};