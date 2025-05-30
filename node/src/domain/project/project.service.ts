import HttpError, {CommonError} from "../../errors/http-error";
import projectRepository from "./project.repository";
import Project from "./project.dto";
import ProjectHistory from "../project-history/project-history.dto";
import { dateFormatterForDate } from "../../util/date-formatter";
import projectHistoryRepository from "../project-history/project-history.repository";
import RequestProject from "./project-request.dto";
import projectHistoryService from "../project-history/project-history.service";

function makeResponse(result?:Project){
    if(!result) throw new HttpError(CommonError.NOT_FOUND, "유효하지 않은 Project");
    return {
        ...result,
        start_date: dateFormatterForDate(result.start_date),
        end_date: dateFormatterForDate(result.end_date),
    };
}

async function getProjects(): Promise<Project[]> {
    const projects:Project[] = await projectRepository.getProjects();
    return projects.map((project)=>makeResponse(project));
}

async function getProject(id: number): Promise<Project> {
    let project:Project = await projectRepository.getProject(id);
    const histories:ProjectHistory[] = await projectHistoryRepository.getProjectHistoryByProject(id);
    project = {
        ...project,
        histories,
    }
    return makeResponse(project);
}

async function createProject(project: Project): Promise<Project> {
    const result:Project = await projectRepository.createProject(project);
    return makeResponse(result);
}

async function updateProject(id: number, dto: RequestProject): Promise<Project> {
    const {histories, ...project} = dto;
    let projectResult:Project = await projectRepository.updateProject(id, project);
    if(histories){
        const results:ProjectHistory[] = await projectHistoryService.updateProjectHistories(id, histories);
        const historyResults = results.map(h=>{ // return data에 불필요한 project_id 제거
            const {project_id, ...history} =h;
            return history
        });
        projectResult = {
            ...projectResult,
            histories:historyResults
        };
    }
    return makeResponse(projectResult);
}

async function deleteProject(id:number): Promise<Project> {
    const project:Project = await projectRepository.deleteProject(id);
    if(!project) throw new HttpError(CommonError.NOT_FOUND, "삭제할 project 찾지 못함");
    return makeResponse(project);
}


export default {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
};
// async function getProjects():Promise<ProjectDto[]>{
//     const projects:Project[] = await projectRepository.getProjects();
//     const results:ProjectDto[] = await Promise.all(
//         projects.map((async p=>{
//             // const client:Client = await clientRepository.getClientById(p.client_id);
//         const step:ProjectHistoryDto = await projectHistoryRepository.getProjectStep(p.idx);
//         return {
//             idx: p.idx,
//             name: p.name,
//             client: p.client,
//             // client: client.name,
//             step: step?.content ? step?.content : 'none',
//             start_date: dateFormatterForDate(p.start_date),
//             end_date: dateFormatterForDate(p.end_date)
//         };
//     })));
//
//     return results;
// }