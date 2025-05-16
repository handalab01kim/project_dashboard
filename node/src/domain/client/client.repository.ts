import pool from "../../config/pool";
import Client from "./client";
import repositoryErrorCatcher from "../../util/repository-error-catcher";

async function getClientById(client_id:number):Promise<Client>{
    try{
        const result = await pool.query(`select * from client where idx = $1;`, [client_id]);
        return result.rows[0];
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}

export default {
    getClientById,

};
