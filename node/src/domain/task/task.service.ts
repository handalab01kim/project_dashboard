import HttpError from "../../types/http-error";
import taskRepository from "./task.repository";
import Task from "./task.model";
import TaskDto from "./task.dto";
import { dateFormatterForDate } from "../../util/date-formatter";
// import Assignee from "./assignee.model";

async function getTasks():Promise<TaskDto[]>{
    const tasks:Task[] = await taskRepository.getTasks();
    return await Promise.all(tasks.map(async (task)=>{
        console.log("MYDEBUG1", dateFormatterForDate(task.start_date), " ///// ", task.start_date);
        // const assignees:string[] = await taskRepository.getAssignees(task.idx);
        return {
            idx: task.idx,
            name: task.name,
            step: task.step,
            assignee: task.assignee,
            start_date: dateFormatterForDate(task.start_date),
            end_date: dateFormatterForDate(task.end_date),
            project: task.project,
            content: task.content,
            // assignee: assignees
        }
    }));
}
// 시간 변경 -> update부터..
async function updateTask(id:number, task:Task):Promise<TaskDto>{
    const result:Task = await taskRepository.updateTask(id, task);

    return result;
}

export default {
    getTasks,
    updateTask,
};