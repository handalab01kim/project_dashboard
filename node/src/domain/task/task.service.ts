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
// function getMonthAndWeekFromDate(date:any){
//     const currentDate = date.getDate();
//     const firstDay = new Date(date.setDate(1)).getDay();

//     return {
//         month: date.getMonth()+1,
//         week:(Math.ceil((currentDate + firstDay) / 7))
//     };
// }
function getMonthAndWeekFromDate(inputDate: Date) {
    const date = new Date(inputDate); // 원본 보호

    const currentDate = date.getDate();
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDay = firstOfMonth.getDay(); // 달의 첫날 요일

    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        week: Math.ceil((currentDate + firstDay) / 7),
    };
}

// GET API []
async function fetchWeeklyTasks(inputWeek: number | undefined):Promise<any>{
    const { start, end } = getWeekRange(inputWeek);

    const startDate = new Date(start);
    const endDate = new Date(end);

    const startInfo = getMonthAndWeekFromDate(new Date(startDate));
    const endInfo = getMonthAndWeekFromDate(new Date(endDate));

    const year = startInfo.year === endInfo.year
        ? [startInfo.year]
        : [startInfo.year, endInfo.year];

    const month = startInfo.month === endInfo.month
        ? [startInfo.month]
        : [startInfo.month, endInfo.month];

    const week = startInfo.month === endInfo.month && startInfo.week === endInfo.week
        ? [startInfo.week]
        : [startInfo.week, endInfo.week];

    const taskData = await getTasksByWeek(inputWeek);

    return {
        year,
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
            data: tasks.map(task=>makeResponse(task)),
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

// GET assignee API
async function getAssignees():Promise<string[]>{
    return  await taskRepository.getAssignees();
}

function getDateRangeOfWeekIndex(index: number) {
    const { start, end } = getWeekRange(index);
    return { start: new Date(start), end: new Date(end) };
}

// GET API; 월, 주차 → week-idx (week=0: 금주)
// async function getWeekIndexFromMonthAndWeek(year: number, month: number, week: number): Promise<number> {
//     const today = new Date();
//     for (let offset = -52; offset <= 52; offset++) {
//         const { start, end } = getWeekRange(offset);
//         const startDate = new Date(start);
//         const endDate = new Date(end);

//         const startInfo = getMonthAndWeekFromDate(startDate);
//         const endInfo = getMonthAndWeekFromDate(endDate);

//         // 해당 주가 걸치는 경우에 포함 처리
//         const months = new Set([startInfo.month, endInfo.month]);
//         const weeks = new Set([startInfo.week, endInfo.week]);

//         if (months.has(month) && weeks.has(week)) {
//             return offset;
//         }
//     }
//     throw new HttpError(CommonError.NOT_FOUND, "해당 월/주차에 대응하는 week index를 찾을 수 없습니다.");
// }
async function getWeekIndexFromMonthAndWeek(
    year: number,
    month: number,
    week: number
): Promise<number> {
    const base = new Date(); // 오늘 기준
    let offset = 0;

    const getKey = (date: Date): [number, number, number] => {
        const { year, month, week } = getMonthAndWeekFromDate(date);
        return [year, month, week];
    };

    const targetKey: [number, number, number] = [year, month, week];
    const baseKey = getKey(base);

    const compare = (a: [number, number, number], b: [number, number, number]) => {
        if (a[0] !== b[0]) return a[0] - b[0]; // year
        if (a[1] !== b[1]) return a[1] - b[1]; // month
        return a[2] - b[2]; // week
    };

    const direction = compare(targetKey, baseKey) > 0 ? 1 : -1;

    while (true) {
        const { start, end } = getWeekRange(offset);
        const startKey = getKey(new Date(start));
        const endKey = getKey(new Date(end));

        if (
            compare(startKey, targetKey) === 0 ||
            compare(endKey, targetKey) === 0
        ) {
            return offset;
        }

        const worstKey = direction === 1 ? startKey : endKey;
        if (compare(worstKey, targetKey) * direction > 0) break;

        offset += direction;
    }

    throw new HttpError(CommonError.NOT_FOUND, "해당 연/월/주차에 대응하는 week index를 찾을 수 없습니다.");
}





export default {
    fetchWeeklyTasks,
    getTasksByMothAndWeek,
    getTasksByWeek, // x
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getAssignees,
    getWeekIndexFromMonthAndWeek,
};