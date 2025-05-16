import pool from "../../config/pool";
import Task from "./task.model";
import repositoryErrorCatcher from "../../util/repository-error-catcher";
import HttpError from "../../types/http-error";

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

async function updateTasks(task:Task):Promise<Task[]>{
    try{
        // if(typeof task.project==='string') throw new HttpError(500, "INTERNAL SERVER ERROR", "task.project must be number type");
        
        let response;
        const {idx, ...dtos} = task;
        console.log(idx);

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
        // if(Object.keys(dtos).length!==0){ // roi 제외 비어있지 않으면 실행
        //     const setClause:string = Object.keys(dtos)
        //         .map((key,idx)=>`${key}=$${idx+2}`)
        //         .join(", ");
        //     const query:string = `update channel_info set ${setClause} where id=$1 returning *`;
        //     const result = await pool.query(query, [id, ...Object.values(dtos)]);
        //     response = result.rows[0];
        //     if (!response) return response; // id 잘못 입력 시 종료
        // }else{
        //     response=await getChannelInfo(id);
        // }

        // if(dto.roi){
        //     const {rows} = await pool.query("update channel_roi set pos = $2 where id = $1 returning *", [id, dto.roi]);
        //     const roi = rows[0].pos;
        //     response = {...response, roi};
        // } else{
        //     const {rows} = await pool.query("select pos from channel_roi where id=$1", [id]);
        //     const roi = rows[0].pos;
        //     response = {...response,roi};
        // }
        return response;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

export default {
    getTasks,
    getAssignees,
    updateTasks,
};