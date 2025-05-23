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

function getWeekRange(week = 0) {
    const today = new Date();
    const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dayOfWeek = now.getDay(); // 요일 0~7

    const startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek + 7 * week);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return {
        start: formatDate(startDate),
        end: formatDate(endDate),
    };
}
// function formatDate(date:any) { // -> ISO 그대로 출력
//     return date.toISOString(); // 'YYYY-MM-DD'
// } // toString() 도 가능은 함
function formatDate(date: Date): string { // -> timezone 에 맞춰 출력
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}



async function getAllTasks(week: number | undefined):Promise<Task[]>{
    const period:{start:string, end:string} = getWeekRange(week);
    // console.log(period);
    const tasks:Task[] = await taskRepository.getAllTasks(period);
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