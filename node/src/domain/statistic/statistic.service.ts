import HttpError from "../../types/http-error";
import statisticRepository from "./statistic.repository";
import Statistic, {CountInfo} from "./types/statistic";

async function getStatistic():Promise<Statistic>{
    const sales:CountInfo = await statisticRepository.getSalesCountInfo();
    const progress:CountInfo = await statisticRepository.getProgressCountInfo();
    const issue:CountInfo = await statisticRepository.getIssueCountInfo();
    const response:Statistic = {
        sales: sales,
        progress: progress,
        issue: issue
    };
    return response;
}


export default {
    getStatistic,
};