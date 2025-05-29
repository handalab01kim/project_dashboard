import pool from "../../config/pool";
import Project from "./project.dto";
import repositoryErrorCatcher from "../../util/repository-error-catcher";
import { QueryResult } from "pg";
import HttpError, {CommonError} from "../../errors/http-error";

async function getProjectName(id: number): Promise<string> {
    try{
        const result:QueryResult<Project> = await pool.query(`select name from project where idx = $1;`, [id]);
        if (!result.rows[0] || !result.rows[0].name) {
            throw new HttpError(CommonError.BAD_REQUEST, "유효하지 않은 프로젝트 아이디입니다.");
        }
        return result.rows[0].name;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function getProjectIdx(name: string): Promise<number> {
    try{
        const result:QueryResult<Project> = await pool.query(`select idx from project where name = $1;`, [name]);
        if (!result.rows[0] || !result.rows[0].idx) {
            throw new HttpError(CommonError.BAD_REQUEST, "유효하지 않은 프로젝트 이름입니다.");
        }
        return result.rows[0].idx;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function getProjects():Promise<Project[]>{
    const sql = `
    select 
        project.*,
        ph.content step
    from project
    left join lateral ( 
        select content
        from project_history
        where project_id = project.idx
        order by project_history.idx DESC
        limit 1
        ) AS ph ON true
    order by project.idx desc;
    `; // project 별 최근 history => step, 개별 서브 쿼리
    try{
        const result:QueryResult<Project> = await pool.query(sql);
        return result.rows;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
/*
////getProjects 2 - distinct on
SELECT
  p.*,
  ph.content AS step
FROM
  project p
LEFT JOIN (
  SELECT DISTINCT ON (project_id) *
  FROM project_history
  ORDER BY project_id, idx DESC
) ph ON ph.project_id = p.idx;

////getProjects 3 - with (CTE)
WITH latest_history AS (
  SELECT DISTINCT ON (project_id) *
  FROM project_history
  ORDER BY project_id, idx DESC
)
SELECT
  p.*,
  lh.content AS step
FROM
  project p
LEFT JOIN latest_history lh ON lh.project_id = p.idx;


 */

async function getProject(id: number):Promise<Project>{
    const sql = `
        select 
            project.*,
            ph.content step
        from project
        left join lateral ( 
            select content
            from project_history
            where project_id = project.idx
            order by project_history.idx DESC
            limit 1
            ) AS ph ON true
        where project.idx = $1;
    `;
    try{
        const result:QueryResult<Project> = await pool.query(sql, [id]);
        return result.rows[0];
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function createProject(project:Project):Promise<Project>{
    const sql = `
        insert into project (name, client, start_date, end_date, leader, client_assignee)
        values ($1, $2, $3, $4, $5, $6) returning *;
    `;
    const values = [project.name, project.client, project.start_date, project.end_date, project.leader, project.client_assignee];
    try{
        const result = await pool.query(sql, values);
        return result.rows[0];
    }catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function updateProject(id:number, project: Project):Promise<Project>{
    try{
        if(Object.keys(project).length === 0){
            const p = await getProject(id);
            if (!p) {
                throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 Project");
            }
            const { step, ...dto } = p;
            return dto;
        }
        const values: any[] = [id];
        const setClauseParts: string[] = [];
        let idx = 2;

        for(const [key, value] of Object.entries(project)) {
            setClauseParts.push(`${key} = $${idx}`);
            values.push(value);
            idx++;
        }

        const sql = `
            update project
            set ${setClauseParts.join(',')}
            where idx = $1
            returning *;
        `;

        const result = await pool.query(sql, values);
        return result.rows[0];
    }catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function deleteProject(id: number|number[]):Promise<Project>{
    try{
        const ids = Array.isArray(id) ? id : [id];

        if(ids.length === 0){
            throw new HttpError(CommonError.BAD_REQUEST, "no indexes received");
        }
        const sql = `
            delete from project where idx in (${ids.map((_, i)=>`$${i+1}`)}) returning *;
        `;

        const result = await pool.query(sql, ids);
        return result.rows[0];
    }catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
export default {
    getProjectName,
    getProjectIdx,
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
};
