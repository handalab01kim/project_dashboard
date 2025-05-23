import {Request, Response, NextFunction} from "express";
import HttpError, {CommonError} from "../../errors/http-error";
import taskService from "./task.service";
import Task from "./task.dto";

async function getTasksByWeek(req:Request, res:Response, next: NextFunction){
    try{
        const week:number|undefined = req.query.week ? Number(req.query.week) : undefined; // 0 => undefined

        const tasks:Task[] = await taskService.fetchWeeklyTasks(week);
        res.status(200).json(tasks);
    } catch(e){
        next(e);
    }
}

async function getTasksByMothAndWeek(req:Request, res:Response, next: NextFunction){
    try{
        const year:number|undefined = req.params.year ? Number(req.params.year) : undefined;
        const month:number|undefined = req.params.month ? Number(req.params.month) : undefined;
        if(isNaN(Number(year)) || isNaN(Number(month))){
            throw new HttpError(CommonError.BAD_REQUEST_TYPE, "Invalid type");
        }
        if(Number(year)<=0 || Number(month)<1 || Number(month)>12){
            throw new HttpError(CommonError.BAD_REQUEST_TYPE, "Invalid range");
        }
        const results:{week:number, data: Task[]}[] = await taskService.getTasksByMothAndWeek(year,month);
        if(results.length===0){
            throw new HttpError(CommonError.BAD_REQUEST_TYPE, "Invalid value");
        }
        res.status(200).json(results);
    } catch(e){
        next(e);
    }
}

async function getTask(req:Request, res:Response, next: NextFunction){
    try{
        const id:number = Number(req.params.id);
        const tasks:Task = await taskService.getTask(id);
        res.status(200).json(tasks);
    } catch(e){
        next(e);
    }
}

async function createTask(req:Request, res:Response, next: NextFunction){
    try{
        const task:Task = req.body;
        const tasks:Task = await taskService.createTask(task);
        res.status(200).json(tasks);
    } catch(e){
        next(e);
    }
}

async function updateTask(req:Request, res:Response, next: NextFunction){
    try{
        const id:number = Number(req.params.id);
        const task:Task = req.body;
        const tasks:Task = await taskService.updateTask(id, task);
        res.status(200).json(tasks);
    } catch(e){
        next(e);
    }
}

async function deleteTask(req:Request, res:Response, next: NextFunction){
    try{
        const id:number = Number(req.params.id);
        const tasks:Task = await taskService.deleteTask(id);
        res.status(200).json(tasks);
    } catch(e){
        next(e);
    }
}

export default {
    getTasksByWeek,
    getTasksByMothAndWeek,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};
