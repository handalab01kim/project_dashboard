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
    if(!task) throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 task");
    let projectName;

    if (task.project_id != null) {
        projectName = await projectRepository.getProjectName(task.project_id);
    } else throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 task");

    const returnTask = {
        ...task,
        project: projectName
    };

    const { project_id, ...dto } = returnTask;
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

async function deleteTask(idx: number|number[]):Promise<Task[]>{
    const tasks:Task[] = await taskRepository.deleteTask(idx);
    if(tasks.length === 0){throw new HttpError(CommonError.NOT_FOUND, "삭제할 task 찾지 못함");}
    return await Promise.all(tasks.map(async (task)=> changeProjectIdToName(makeResponse(task))));
    // return tasks.map((task)=>makeResponse(task));
}

export default {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};