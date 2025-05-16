import pool from "../../config/pool";
import ProjectHistory from "./project-history";
import repositoryErrorCatcher from "../../util/repository-error-catcher";

async function getProjectHistory(project_id:number):Promise<ProjectHistory[]>{
    try{
        const result = await pool.query(`select * from project_history where project_id = $1 order by idx ASC;`, [project_id]);
        return result.rows;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function getProjectStep(project_id:number):Promise<ProjectHistory>{
    try{
        const result = await pool.query(`select * from project_history where project_id = $1 order by idx DESC limit 1;`, [project_id]);
        return result.rows[0];
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

export default {
    getProjectHistory,
    getProjectStep,
};
