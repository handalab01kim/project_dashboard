import { Request, Response, NextFunction } from 'express';
import config from "../config/config";
import HttpError from '../types/http-error';
// import systemLogService from '../domain/system-log/system-log.service';

const magenta = "\x1b[35m";
const red = "\x1b[31m";
const white = "\x1b[37m";

export default function exceptionHandler(err:HttpError, req:Request, res:Response, next:NextFunction){
    const statusCode:number = err.statusCode || 500; // 기본값 500
    if(config.dev){ // 개발 환경 에러 출력
        if (Math.floor(statusCode/100)===4){
            console.log(`${magenta}[Client-Error] ${err.message || "Undefined_Error"}${white}`);
            
        } else{ // 500~
            console.log(`${red}[Server-Error] ${err.message || "Undefined_Error"}${white}`);
            console.log(`${red}  [Error.stack] ${err.stack}\x1b[37m`); // 500~ 에러 stack 출력

        }
    }
    const exceptionProcess = Math.floor(statusCode/100)===4 ? "FE Server" : "BE Server";
    // systemLogService.recordSystemLog(exceptionProcess, `error: ${err.type} - ${err.message}`); // DB 로그 기록
    res.status(statusCode).json({
        // code: 1,
        error: err.type || "Internal Server Error",
        message: err.message || "Undefined Error",
    });
}