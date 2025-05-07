import {Request, Response, NextFunction} from "express";
import HttpError from "../../types/http-error";
import taskService from "./task.service";
import Task from "./task";

async function getTasks(req:Request, res:Response, next: NextFunction){
    try{
        // const week:number = Number(req.params.week);
        const tasks:Task[] = await taskService.getTasks();
        res.status(200).json(tasks);
    } catch(e){
        next(e);
    }
}


export default {
    getTasks,
};
