import HttpError, {CommonError} from "../../errors/http-error";
import projectHistoryRepository from "./project-history.repository";
import projectRepository from "../project/project.repository";
import ProjectHistory from "./project-history.dto";
import { dateFormatterForDate } from "../../util/date-formatter";

async function getProjectHistory(project:string): Promise<ProjectHistory[]> {
    const result:ProjectHistory[] = await projectHistoryRepository.getProjectHistory(project);
    if(result.length === 0){
        await projectRepository.getProjectIdx(project); // 프로젝트 이름이 유효하지 않으면 throw
    }
    return result;
}
async function getProjectHistories(projectId:number): Promise<ProjectHistory[]> {
    const result:ProjectHistory[] = await projectHistoryRepository.getProjectHistories(projectId);
    return result;
}

async function createProjectHistory(project: string, content: string): Promise<ProjectHistory> {
    const result:ProjectHistory = await projectHistoryRepository.createProjectHistory(project, content);
    if(!result) throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 project history");
    return result;
}

async function updateProjectHistory(id:number, content: string): Promise<ProjectHistory> {
    const result:ProjectHistory = await projectHistoryRepository.updateProjectHistory(id, content);
    if(!result) throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 project history");
    return result;
}

async function deleteProjectHistory(id:number): Promise<ProjectHistory> {
    const result:ProjectHistory = await projectHistoryRepository.deleteProjectHistory(id);
    if(!result) throw new HttpError(CommonError.NOT_FOUND, "삭제할 project history 찾지 못함");
    return result;
}

async function updateProjectHistories(projectId:number, histories: string[]): Promise<ProjectHistory[]> {
    const deleted:ProjectHistory[] = await projectHistoryRepository.deleteProjectHistoryByProject(projectId);
    if(histories.length===0){
        return [];
    }
    const newHistories:ProjectHistory[] = histories.map((history, i)=>({
        idx: i+1,
        project_id: projectId,
        content: history
    }));
    const result:ProjectHistory[] = await projectHistoryRepository.updateProjectHistories(projectId, newHistories);
    return result;
}


export default {
    getProjectHistory,
    createProjectHistory,
    updateProjectHistory,
    deleteProjectHistory,
    updateProjectHistories,
    getProjectHistories,
};
