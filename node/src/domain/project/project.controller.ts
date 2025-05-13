import {Request, Response, NextFunction} from "express";
import HttpError from "../../types/http-error";
import projectService from "./project.service";
import Project from "./project";

async function getProjects(req:Request, res:Response, next: NextFunction){
    try{
        const week:number = Number(req.query.week);
        // if(isNaN(week)){
        //     res.status(500).json();
        //     return;
        // }
        const projects:Project[] = await projectService.getProjects();
        res.status(200).json(projects);
    } catch(e){
        next(e);
    }
}




export default {
    getProjects,
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


