import { Request, Response, NextFunction } from 'express';
import config from "../config/config";

const cyan = "\x1b[36m";
const blue = "\x1b[34m";
const yellow = "\x1b[33m";
const magenta = "\x1b[35m";
const red = "\x1b[31m";
const white = "\x1b[37m";

const isDeepLog:boolean = config.deepLog;

let color = yellow; // console.log font color

export default function logger(req:Request, res:Response, next:NextFunction){
    // 전처리 로그
    color = white;
    if (isDeepLog){
        console.log(`\n${req.ip}\n${color}${req.method} ${req.url} - ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}\nreq-body ${JSON.stringify(req.body, null, 2)}`, "\x1b[37m");
    } //:${req.socket.remotePort}
    else{
        console.log(`\n${color}${req.method} ${req.url} - ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`, "\x1b[37m");
    }
    // color = white;

    let responseBody: any = undefined; // deepLog 시 응답 가로채어 body 저장
    // 전역 변수로 쓸 경우: 정상 요청 -> 유효하지 않은 url 요청 -> 이전 요청의 응답 body 출력 됨

    // res.send응답 가로채기
    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
        responseBody = body; // 출력용 body 저장
        return originalSend(body); // 기존 res.send 실행
    };

    // 후처리 로그
    res.on("finish", () => {
        if(res.statusCode >= 400 && res.statusCode < 500)
            color = yellow;
        else if (res.statusCode >= 500 && res.statusCode < 600)
            color = magenta;
        else
            color = cyan;

        if (isDeepLog){
            console.log(`${color}${res.statusCode} - ${req.method} ${req.url}`);
            
            // body 출력
            let logBody = responseBody;
            if (Buffer.isBuffer(responseBody)) {
                logBody = responseBody.toString('utf8');
            } else if (typeof responseBody === 'object') {
                logBody = JSON.stringify(responseBody, null, 2);
            }
            console.log(`res-body ${logBody}\x1b[37m\n`);
        }
        else{
            console.log(`${color}${res.statusCode} - ${req.method} ${req.url}\x1b[37m\n`);
        }
        // color = yellow;
    });

    next();
}