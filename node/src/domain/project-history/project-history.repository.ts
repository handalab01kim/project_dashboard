import pool from "../../config/pool";
import ProjectHistory from "./project-history.dto";
import repositoryErrorCatcher from "../../util/repository-error-catcher";

async function getProjectHistory(project: string): Promise<ProjectHistory[]> {
    try {
        const result = await pool.query(`with p as (select idx from project where name = $1)
                                         select *
                                         from project_history
                                         where project_id = (SELECT idx FROM p)
                                         order by idx ASC;`, [project]);
        return result.rows;
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function getProjectHistoryByProject(projectId: number): Promise<ProjectHistory[]> {
    try {
        const result = await pool.query(`select idx, content
                                         from project_history
                                         where project_id = $1
                                         order by idx ASC;`, [projectId]);
        return result.rows;
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function getProjectHistories(projectId: number): Promise<ProjectHistory[]> {
    try {
        const result = await pool.query(`select idx, content
                                         from project_history
                                         where project_id = $1
                                         order by idx ASC;`, [projectId]);
        return result.rows;
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function createProjectHistory(project: string, content: string): Promise<ProjectHistory> {
    const sql = `
        insert into project_history(project_id, content)
        select idx, $2
        from project
        where name = $1 returning *;
    `;
    const values = [project, content];
    try {
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function updateProjectHistory(id: number, content: string): Promise<ProjectHistory> {
    const sql = `
        update project_history
        set content = $2
        where idx = $1
        returning *`;
    const values = [id, content];
    try {
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function updateProjectHistories(projectId: number, histories: ProjectHistory[]): Promise<ProjectHistory[]> {
    const valuesClause = histories.map((history, i)=>`($${i*3+1}, $${i*3+2}, $${i*3+3})`).join(",");
    // const values = histories.flatMap(history=>Object.values(history));
    const values = histories.flatMap(Object.values);
    const sql = `
        insert into project_history(idx, project_id, content)
        values ${valuesClause}
        returning *`;
    try {
        const result = await pool.query(sql, values);
        return result.rows;
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function deleteProjectHistoryByProject(projectid: number): Promise<ProjectHistory[]> {
    const sql = `
        delete
        from project_history
        where project_id = $1 returning *;
    `;
    const values = [projectid];
    try {
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

async function deleteProjectHistory(id: number): Promise<ProjectHistory> {
    const sql = `
        delete
        from project_history
        where idx = $1 returning *;
    `;
    const values = [id];
    try {
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (e: any) {
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}


export default {
    getProjectHistory,
    createProjectHistory,
    updateProjectHistory,
    deleteProjectHistory,
    getProjectHistoryByProject,
    updateProjectHistories,
    deleteProjectHistoryByProject,
    getProjectHistories,
    // getProjectStep,
};


// async function getProjectStep(project_id:number):Promise<ProjectHistory>{
//     try{
//         const result = await pool.query(`select * from project_history where project_id = $1 order by idx DESC limit 1;`, [project_id]);
//         return result.rows[0];
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// }