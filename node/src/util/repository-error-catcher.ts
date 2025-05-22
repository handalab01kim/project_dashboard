import HttpError, {CommonError} from "../errors/http-error";

export default function repositoryErrorCatcher(e:any){
    if(e instanceof HttpError) throw e;
    if(e.code === '22001') throw new HttpError(CommonError.BAD_REQUEST, "허용된 최대 길이를 초과하는 필드가 포함됨");
    if(e.code === '23505') throw new HttpError(CommonError.CONFLICT, `중복된 필드가 삽입됨; ${e.message}`);
    if(e.code === 'ECONNREFUSED' || e.code === 'ETIMEDOUT' || e.code === '28P01') throw new HttpError(CommonError.DB_CONNECTION_ERROR);
    const errorMessage = e.message ? e.message : "unknown-error"
    throw new HttpError(CommonError.INTERNAL_SERVER_ERROR, errorMessage);
}