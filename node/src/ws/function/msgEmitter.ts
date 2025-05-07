// import { Namespace } from "socket.io";
// // import systemLogService from '../../domain/system-log/system-log.service';
// import config from "../../config/config";

// export default function(nsp: Namespace, eventName: string, msg: any){
//     let parsedMsg;
    
//     if(typeof msg === "string"){
//         try{ // text 타입으로 받았을 경우
//             parsedMsg = JSON.parse(msg);
//         } catch (e){
//             // systemLogService.recordSystemLog("BE Server", `error: Websocket - JSON 파싱 실패: {eventName: ${eventName}, message: ${msg}}; 에러메시지: ${e}`)
//             if(config.dev) console.log("\nJSON 파싱 실패 ",e,"\n");
//             return; 
//         }
//     } else{ // json 타입으로 받았을 경우
//         parsedMsg = msg;
//     }
//     // nsp.emit(eventName, JSON.stringify(parsedMsg));
//     nsp.emit(eventName, parsedMsg);

//     return parsedMsg;
// }