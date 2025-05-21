export default interface Task {
    idx?: number;
    name?: string;
    step?: string|number;
    assignee?: string;
    start_date?: string;
    end_date?: string;
    project?: string | number;
    content?: string;
}