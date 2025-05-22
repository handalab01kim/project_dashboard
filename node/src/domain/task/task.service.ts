import HttpError, {CommonError} from "../../errors/http-error";
import taskRepository from "./task.repository";
import Task from "./task.dto";
import { dateFormatterForDate } from "../../util/date-formatter";
import projectRepository from "../project/project.repository";
// import Assignee from "./assignee.model";

function makeResponse(result?:Task){
    if(!result) throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 task");
    return {
        ...result,
        start_date: dateFormatterForDate(result.start_date),
        end_date: dateFormatterForDate(result.end_date),
    };
}
async function changeProjectIdToName(task?:Task){
    if (!task?.project_id) {
        throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 task");
    }

    const project = await projectRepository.getProjectName(task.project_id);
    const { project_id, ...dto } = { ...task, project };
    return dto;
}

async function getAllTasks():Promise<Task[]>{
    const tasks:Task[] = await taskRepository.getAllTasks();
    return await Promise.all(tasks.map(async (task)=>makeResponse(task)));
}

async function getTask(id:number):Promise<Task>{
    const result:Task = await taskRepository.getTask(id);
    return makeResponse(result);
}

async function updateTask(id:number, task:Task):Promise<Task>{
    const result:Task = await taskRepository.updateTask(id, task);
    return await changeProjectIdToName(makeResponse(result));
}

async function createTask(task:Task):Promise<Task>{
    const result:Task = await taskRepository.createTask(task);
    return await changeProjectIdToName(makeResponse(result));
}

async function deleteTask(id: number):Promise<Task>{
    const result:Task = await taskRepository.deleteTask(id);
    if(!result){throw new HttpError(CommonError.NOT_FOUND, "삭제할 task 찾지 못함");}
    return await changeProjectIdToName(makeResponse(result));
}

export default {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};