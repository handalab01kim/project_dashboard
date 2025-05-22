import {Request, Response, NextFunction} from "express";
import HttpError from "../../errors/http-error";
import projectService from "./project.service";
import Project from "./project.dto";

async function getProjects(req:Request, res:Response, next: NextFunction){
    try{
        const result:Project[] = await projectService.getProjects();
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}
async function getProject(req:Request, res:Response, next: NextFunction){
    try{
        const id:number = Number(req.params.id);
        const result:Project = await projectService.getProject(id);
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}
async function createProject(req:Request, res:Response, next: NextFunction){
    try{
        const project:Project = req.body;
        const result:Project = await projectService.createProject(project);
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}
async function updateProject(req:Request, res:Response, next: NextFunction){
    try{
        const id:number = Number(req.params.id);
        const project:Project = req.body;
        const result:Project = await projectService.updateProject(id, project);
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}
async function deleteProject(req:Request, res:Response, next: NextFunction){
    try{
        const id:number = Number(req.params.id);
        const result:Project = await projectService.deleteProject(id);
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}

export default {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
};


// async function getChannelInfo(req:Request, res:Response, next: NextFunction){
//     try{
//         const id:number = Number(req.params.id);
//         if(isNaN(id)) throw new HttpError(400, "Bad Request", "Invalid ID type: NaN");
//         const channelInfo:ChannelInfo = await channelInfoService.getChannelInfo(id);
//         res.status(200).json(channelInfo);
//     } catch(e){
//         next(e);
//     }
// }


// async function updateChannelInfo(req:Request, res:Response, next: NextFunction){
//     try{
//         const id:number = Number(req.params.id);
//         if(isNaN(id)) throw new HttpError(400, "Bad Request", "Invalid ID type: NaN");
//         const requestDTO:ChannelInfo = req.body;
//         if(!channelInfoTypeCheck(requestDTO)) throw new HttpError(400, "Bad Request", "Received Invalid type");
//         const channelInfo:ChannelInfo = await channelInfoService.updateChannelInfo(id, requestDTO);
//         res.status(200).json(channelInfo);
//     } catch(e){
//         next(e);
//     }
// }




// async function getAllChannelStatus(req:Request, res:Response, next: NextFunction){
//     try{
//         const ChannelStatus:ChannelStatus[] = await channelInfoService.getAllChannelStatus();
//         res.status(200).json(ChannelStatus);
//     } catch(e){
//         next(e);
//     }
// }

// async function getChannelStatus(req:Request, res:Response, next: NextFunction){
//     try{
//         const id:number = Number(req.params.id);
//         if(isNaN(id)) throw new HttpError(400, "Bad Request", "Invalid ID type: NaN");
//         const ChannelStatus:ChannelStatus = await channelInfoService.getChannelStatus(id);
//         res.status(200).json(ChannelStatus);
//     } catch(e){
//         next(e);
//     }
// }

// async function updateChannelStatus(req:Request, res:Response, next: NextFunction){
//     try{
//         const id:number = Number(req.params.id);
//         if(isNaN(id)) throw new HttpError(400, "Bad Request", "Invalid ID type: NaN");
//         const status:number = Number(req.body.status);
//         if(isNaN(status)) throw new HttpError(400, "Bad Request", "Invalid status type: NaN");
//         if(status==0){ // 채널 이벤트 상태 off
//             cancelTimeout(id);
//         }
//         const ChannelStatus:ChannelStatus = await channelInfoService.updateChannelStatus(id, status);
//         res.status(200).json({ChannelStatus});
//         // res.status(200).json({message:"Event notifications have been successfully disabled."});
//     } catch(e){
//         next(e);
//     }
// }


