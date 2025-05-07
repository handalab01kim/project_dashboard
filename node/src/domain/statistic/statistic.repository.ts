import pool from "../../config/pool";
import Statistic, {CountInfo} from "./types/statistic";
// import ProjectStatus from "./types/project-status";
// import Issue from "./types/issue";
import repositoryErrorCatcher from "../../util/repository-error-catcher";

async function getSalesCountInfo():Promise<CountInfo>{
    try{
        const total = (await pool.query(`select sum(sales) s from project_status;`)).rows[0].s;
        const finished = (await pool.query(`select sum(sales) s from project_status where is_finished = true;`)).rows[0].s;
        const result:CountInfo = {
            total:Number(total?? 0),
            current:Number(finished?? 0),
        }
        return result;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function getProgressCountInfo():Promise<CountInfo>{
    try{
        const total = (await pool.query(`select count(*) from project_status;`)).rows[0].count;
        const finished = (await pool.query(`select count(*) from project_status where is_finished = true;`)).rows[0].count;
        const result:CountInfo = {
            total:total? Number(total): 0,
            current:finished? Number(finished): 0,
        }
        return result;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function getIssueCountInfo():Promise<CountInfo>{
    try{
        const total = (await pool.query(`select count(*) from issue;`)).rows[0].count;
        const finished = (await pool.query(`select count(*) from issue where is_finished = true;`)).rows[0].count;
        const result:CountInfo = {
            total:total? Number(total): 0,
            current:finished? Number(finished): 0,
        }
        return result;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}


export default {
    getSalesCountInfo,
    getProgressCountInfo,
    getIssueCountInfo,
};