import HttpError from "../../types/http-error";
import taskRepository from "./task.repository";
import Task from "./task.model";
import TaskDto from "./task.dto";
import { dateFormatterForDate } from "../../util/date-formatter";
// import Assignee from "./assignee.model";

async function getTasks():Promise<TaskDto[]>{
    const tasks:Task[] = await taskRepository.getTasks();
    return await Promise.all(tasks.map(async (task)=>{
        const assignees:string[] = await taskRepository.getAssignees(task.idx);
        return {
            idx: task.idx,
            name: task.name,
            step: task.step,
            start_date: dateFormatterForDate(task.start_date),
            end_date: dateFormatterForDate(task.end_date),
            project: task.project,
            assignee: assignees
        }
    }));
}


export default {
    getTasks,
};