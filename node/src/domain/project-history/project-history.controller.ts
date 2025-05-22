import {Request, Response, NextFunction} from "express";
import HttpError from "../../errors/http-error";
import projectHistoryService from "./project-history.service";
import ProjectHsitory from "./project-history.dto";

async function getProjectHistory(req:Request, res:Response, next: NextFunction){
    try{
        const project:string = req.params.project;
        const result:ProjectHsitory[] = await projectHistoryService.getProjectHistory(project);
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}

async function createProjectHistory(req:Request, res:Response, next: NextFunction){
    try{
        const project:string = req.params.project;
        const content:string = req.body.content;
        const result:ProjectHsitory = await projectHistoryService.createProjectHistory(project, content);
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}
async function updateProjectHistory(req:Request, res:Response, next: NextFunction){
    try{
        const id:number = Number(req.params.id);
        const content:string = req.body.content;
        const result:ProjectHsitory = await projectHistoryService.updateProjectHistory(id, content);
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}
async function deleteProjectHistory(req:Request, res:Response, next: NextFunction){
    try{
        const id:number = Number(req.params.id);
        const result:ProjectHsitory = await projectHistoryService.deleteProjectHistory(id);
        res.status(200).json(result);
    } catch(e){
        next(e);
    }
}

export default {
    getProjectHistory,
    createProjectHistory,
    updateProjectHistory,
    deleteProjectHistory,
};