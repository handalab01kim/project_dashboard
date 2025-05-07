export default interface Statistic {
    sales:CountInfo;
    progress:CountInfo;
    issue:CountInfo;
}
export interface CountInfo {
    total:number;
    current:number;
}
