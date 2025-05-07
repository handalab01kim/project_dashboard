import HttpError from "../types/http-error";

// system-log.repository를 제외한 모든 repository error catcher
export default function repositoryErrorCatcher(e:any){
    if(e instanceof HttpError) throw e;
    if(e.code === '22001') throw new HttpError(400, "Bad Request", "Request body contains string that exceeds the maximum allowed length");
    const type:string = e.stack?.split('\n')[1].split("/").at(-1) || "UNDEFINED"
    const errorMessage = e.message ? e.message : "unknown-error"
    throw new HttpError(500, "INTERNAL SERVER ERROR", type+" "+errorMessage);
}