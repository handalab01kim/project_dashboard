import { Request, Response, NextFunction } from 'express';
import HttpError, {CommonError} from '../errors/http-error';
// import config from "../config/config";

// 로그인 & 관리자-권한 필터
// authFilter(true): 관리자만 접근 가능
// authFilter(false): 모두 접근 가능
export default function authFilter(onlyAdmin:boolean){
    return function(req:Request, res:Response, next:NextFunction){
        const member = req.session.member;
        if(!member){
            // return next(new HttpError(401, "Unauthorized", "Accessible after logging in"));
            return next(new HttpError(CommonError.INTERNAL_SERVER_ERROR, "Accessible after logging in"));
        }
        if(onlyAdmin && !member?.admin){
            // return next(new HttpError(403, "Forbidden", "only admin able to access"));
            return next(new HttpError(CommonError.INTERNAL_SERVER_ERROR, "Accessible after logging in"));
        }
        // 나머지 모두 허용
        next();
    }
}
