import HttpError, {CommonError} from "../../errors/http-error";
import taskRepository from "./task.repository";
import Task from "./task.dto";
import { dateFormatterForDate } from "../../util/date-formatter";
import projectRepository from "../project/project.repository";
// import Assignee from "./assignee.model";

// 응답 날짜 데이터 형식 변환
function makeResponse(result?:Task){
    if(!result) throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 task");
    return {
        ...result,
        start_date: dateFormatterForDate(result.start_date),
        end_date: dateFormatterForDate(result.end_date),
    };
}
// project; id -> name
async function changeProjectIdToName(task?:Task){
    if (!task?.project_id) {
        throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 task");
    }

    const project = await projectRepository.getProjectName(task.project_id);
    const { project_id, ...dto } = { ...task, project };
    return dto;
}
// 일주일의 시작(일)/끝(토) 날짜 반환 {week=0: -> 금주, week>0: 다음~주, week<0: 지난~주}
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

// date; ISO -> Asia/Seoul
function formatDate(date: Date): string { // -> timezone 에 맞춰 출력
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// 일주일 task 데이터 반환 {week=0: -> 금주, week>0: 다음~주, week<0: 지난~주}
async function getTasksByWeek(week: number | undefined):Promise<Task[]>{
    const period:{start:string, end:string} = getWeekRange(week);
    // console.log(period);
    const tasks:Task[] = await taskRepository.getTasksByWeek(period);
    return await Promise.all(tasks.map(async (task)=>makeResponse(task)));
}

// 특정 날짜가 몇월, 몇주차인지 반환 {month, week}
function getMonthAndWeekFromDate(date:any){
    const currentDate = date.getDate();
    const firstDay = new Date(date.setDate(1)).getDay();

    return {
        month: date.getMonth()+1,
        week:(Math.ceil((currentDate + firstDay) / 7))
    };
}
// GET API []
async function fetchWeeklyTasks(inputWeek: number | undefined):Promise<any>{
    const {end} = getWeekRange(inputWeek);
    const {month, week} = getMonthAndWeekFromDate(new Date(end));
    const taskData = await getTasksByWeek(inputWeek);
    return {
        month,
        week,
        data: taskData
    };
}
function getWeekRangesByMonth(year: number, month: number) {
    const results = [];
    const firstOfMonth = new Date(year, month - 1, 1); // 달의 첫 날
    const lastOfMonth = new Date(year, month, 0); // 달의 마지막 날

    let current = new Date(firstOfMonth);
    current.setDate(current.getDate() - current.getDay()); // 첫 주 일요일 (달력 상 첫 날)

    let weekNumber = 1;

    while (current <= lastOfMonth) {
        const start = new Date(current);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        // 범위가 일부라도 월에 포함된 경우 => 포함
        if (start.getMonth() === month - 1 || end.getMonth() === month - 1) {
            results.push({
                week: weekNumber++,
                start: formatDate(start),
                end: formatDate(end),
            });
        }

        current.setDate(current.getDate() + 7); // 다음 주
    }
// console.log("monthly-tasks; weeks", results);
    return results;
}

// GET API; tasks by month & week
async function getTasksByMothAndWeek(year?: number, month?: number):Promise<{week:number, data: Task[]}[]>{
    if(!year) year = new Date().getFullYear();
    if(!month) month = new Date().getMonth()+1;
    const weeks:{week:number, start:string, end:string}[] = getWeekRangesByMonth(year, month);
    const results:Task[][]= await Promise.all(weeks.map(async(w)=>
        await taskRepository.getTasksByWeek({start: w.start, end: w.end})
    ));

    return results.map((tasks, index)=>{
        return {
            week: index+1,
            data: tasks
        };
    })
}


// GET API
async function getTask(id:number):Promise<Task>{
    const result:Task = await taskRepository.getTask(id);
    return makeResponse(result);
}

// PATCH API
async function updateTask(id:number, task:Task):Promise<Task>{
    const result:Task = await taskRepository.updateTask(id, task);
    return await changeProjectIdToName(makeResponse(result));
}

// POST API
async function createTask(task:Task):Promise<Task>{
    const result:Task = await taskRepository.createTask(task);
    return await changeProjectIdToName(makeResponse(result));
}
// DELETE API
async function deleteTask(id: number):Promise<Task>{
    const result:Task = await taskRepository.deleteTask(id);
    if(!result){throw new HttpError(CommonError.NOT_FOUND, "삭제할 task 찾지 못함");}
    return await changeProjectIdToName(makeResponse(result));
}

export default {
    fetchWeeklyTasks,
    getTasksByMothAndWeek,
    getTasksByWeek, // x
    getTask,
    createTask,
    updateTask,
    deleteTask,
};