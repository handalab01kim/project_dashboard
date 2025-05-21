/*
global.errorCodes
-1	알 수 없는 오류
-2	데이터베이스 연결상태 오류
-3	데이터베이스 API 호출 오류
-4	데이터 전송 타입 오류
-5	카메라 연결 오류
-6	AI 엔진 오류
-7	영상 스트리밍 오류
*/
export const CommonError = {
    BAD_REQUEST_TYPE:       {statusCode: 400, errorType: "TYPE_ERROR"},
    BAD_REQUEST:            {statusCode: 400, errorType: "BAD_REQUEST"},
    NOT_FOUND:              {statusCode: 404, errorType: "NOT_FOUND"},
    // NOT_FOUND_CHANNEL_ID:   {statusCode: 404, errorType: "NOT_FOUND", description: "Invalid channel ID"},
    CONFLICT:               {statusCode: 409, errorType: "CONFLICT"},
    DB_CONNECTION_ERROR:    {statusCode: 500, errorType: "DB_CONNECTION_ERROR"},
    INTERNAL_SERVER_ERROR:  {statusCode: 500, errorType: "INTERNAL_SERVER_ERROR"},
}

export interface CommonErrorType{
    statusCode: number,
    errorType: string,
    description?: string,
}

export default class HttpError extends Error{
    public statusCode: number = 500;
    public type: string = "INTERNAL_SERVER_ERROR";

    constructor(commonError: CommonErrorType, message?: string){
        super(commonError.description ?
            (message ? `${commonError.description}: ${message}` : commonError.description):
            (message ? message : ""));

        this.statusCode = commonError.statusCode;

        if(commonError.errorType){
            this.type = commonError.errorType;
        }
    }
}

