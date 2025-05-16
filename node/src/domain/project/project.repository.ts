import pool from "../../config/pool";
import Project from "./project.model";
import repositoryErrorCatcher from "../../util/repository-error-catcher";
import { QueryResult } from "pg";

async function getProjects():Promise<Project[]>{
    try{
        const result:QueryResult<Project> = await pool.query(`select * from project;`);
        return result.rows;
    } catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function createProjects(project:Project):Promise<Project[]>{
    try{
        //insert
        const result = await pool.query(`select * from project;`);
        return result.rows;
    }catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function updateProjects():Promise<Project[]>{
    try{
        const result = await pool.query(`select * from project;`);
        return result.rows;
    }catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
async function deleteProjects():Promise<Project[]>{
    try{
        const result = await pool.query(`select * from project;`);
        return result.rows;
    }catch(e:any){
        repositoryErrorCatcher(e);
        return undefined as never;
    }
}
export default {
    getProjects,
    createProjects,
    updateProjects,
    deleteProjects,
};

// async function getAllChannelInfos():Promise<Project[]>{
//     try{
//         const result = await pool.query(`
//             select 
//                 ci.id, 
//                 ci.name, 
//                 ci.description, 
//                 ci.timeset, 
//                 ci.preset, 
//                 ci.rtspurl, 
//                 ci.pixel, 
//                 cr.pos as roi
//             from 
//                 channel_info ci 
//             inner join 
//                 channel_roi cr 
//             on ci.id=cr.id
//             order by id
// `);
//         return result.rows;
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// }

// async function getChannelInfo(id:number):Promise<Project>{
//     try{
//         const result = await pool.query(`
//             select 
//                 ci.id, 
//                 ci.name, 
//                 ci.description, 
//                 ci.timeset, 
//                 ci.preset, 
//                 ci.rtspurl, 
//                 ci.pixel, 
//                 cr.pos as roi
//             from 
//                 channel_info ci 
//             inner join 
//                 channel_roi cr 
//             on ci.id=cr.id
//             where ci.id = $1
//             `, [id]);
//         return result.rows[0];
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// }

// async function updateChannelInfo(id:number, dto:Project):Promise<Project>{
//     try{
//         let response;
//         const {roi, ...dtos} = dto;
//         if(Object.keys(dtos).length!==0){ // roi 제외 비어있지 않으면 실행
//             const setClause:string = Object.keys(dtos)
//                 .map((key,idx)=>`${key}=$${idx+2}`)
//                 .join(", ");
//             const query:string = `update channel_info set ${setClause} where id=$1 returning *`;
//             const result = await pool.query(query, [id, ...Object.values(dtos)]);
//             response = result.rows[0];
//             if (!response) return response; // id 잘못 입력 시 종료
//         }else{
//             response=await getChannelInfo(id);
//         }

//         if(dto.roi){
//             const {rows} = await pool.query("update channel_roi set pos = $2 where id = $1 returning *", [id, dto.roi]);
//             const roi = rows[0].pos;
//             response = {...response, roi};
//         } else{
//             const {rows} = await pool.query("select pos from channel_roi where id=$1", [id]);
//             const roi = rows[0].pos;
//             response = {...response,roi};
//         }
//         return response;
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// }



// async function getAllChannelStatus():Promise<ChannelStatus[]>{
//     try{
//         const result = await pool.query("select * from channel_status order by id");
//         return result.rows;
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// }

// async function getChannelStatus(id:number):Promise<ChannelStatus>{
//     try{
//         const result = await pool.query("select * from channel_status where id = $1", [id]);
//         return result.rows[0];
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// }

// async function updateChannelStatus(id:number,status:number):Promise<ChannelStatus>{
//     try{
//         const result = await pool.query("update channel_status set status=$2 where id=$1 returning *", [id, status]);
//         return result.rows[0];
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// }

// async function getChannelNameById(id:number):Promise<any>{
//     try{
//         const result = await pool.query("select name from channel_info where id = $1", [id]);
//         return result.rows[0];
//     } catch(e:any){
//         repositoryErrorCatcher(e);
//         return undefined as never;
//     }
// }

