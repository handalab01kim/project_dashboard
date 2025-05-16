export default interface TaskDto {
    idx: number;
    name: string;
    step: string|number;
    assignee: string[];
    start_date: string;
    end_date: string;
    project: string | number;
}