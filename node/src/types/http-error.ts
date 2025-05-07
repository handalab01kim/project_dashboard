export default class HttpError extends Error{
    public statusCode: number = 500;
    public type: string = "Internal Server Error";

    constructor(statusCode:number, type:string, message:string) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
    }
}