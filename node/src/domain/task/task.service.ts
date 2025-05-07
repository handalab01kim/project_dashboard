import HttpError from "../../types/http-error";
import taskRepository from "./task.repository";
import Task from "./task";

async function getTasks():Promise<Task[]>{
    const tasks:Task[] = await taskRepository.getTasks();
    return tasks;
}


export default {
    getTasks,
};