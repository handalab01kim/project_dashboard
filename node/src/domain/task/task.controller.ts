import {Request, Response, NextFunction} from "express";
import HttpError from "../../errors/http-error";
import taskService from "./task.service";
import Task from "./task.dto";

async function getAllTasks(req:Request, res:Response, next: NextFunction){
    try{
        // const week:number = Number(req.params.week);
        const tasks:Task[] = await taskService.getAllTasks();
        res.status(200).json(tasks);
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
        const tasks:Task[] = await taskService.deleteTask(id);
        res.status(200).json(tasks);
    } catch(e){
        next(e);
    }
}

export default {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};
