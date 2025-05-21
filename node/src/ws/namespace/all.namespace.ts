// import { Namespace, Server } from "socket.io";
// import msgEmitter from "../function/msgEmitter";
// import historyRepository from "../../domain/history/history.repository";
// import systemLogService from "../../domain/system-log/system-log.service";
// import channelInfoService from "../../domain/channel-info/channel-info.service";
// import config from "../../config/config";
// import saveImage from "../../util/save-image";

// import io from "socket.io-client";
// import ChannelInfo from "../../errors/channel-info";

// const digitalIoSocket = io(config.digital_io_socket);
// const inputSocket = String(config.digital_io_socket).slice(0, -6) + "input";
// const digitalIoInputSocket = io(inputSocket);
// digitalIoSocket.on("message", (data) => {
//     if(data.Stat<0){
//         systemLogService.recordSystemLog("Thrid-Part Server", `${config.digital_io_socket}: ${data.Stat} error!`);
//     }
// });
// digitalIoInputSocket.on("message", (data) => {
//     if(data.Stat<0){
//         systemLogService.recordSystemLog("Thrid-Part Server", `${inputSocket}: ${data.Stat} error!`);
//     }
// });

// const SERVERS: Record<number, string> = {
//     1: "FE Server",
//     2: "BE Server",
//     3: "Analysis Server",
//     4: "Thrid-Part Server"
// };

// const STATUS:string = "status";
// const EVENT:string = "event";

// const timeoutControllers:any = {};

// // function getServerName(){}

// let all:Namespace;
// export default function allNamespace(io: Server){
//     all = io.of("/all");


//     // 중복 시스템 로그 방지 -> 마지막 상태 저장 등의 방법 필요
//     digitalIoSocket.emit("message",{
//         "PORTS":"ALL",
//         "DATA":"0"
//     });

//     all.on("connection", (socket)=>{

//         socket.on(STATUS, (msg)=>{
//             // console.log(socket.handshake.address+ msg);
//             const data = msgEmitter(all, STATUS, msg);
//             const serverIndex = Number(data.server);
//             if(SERVERS[serverIndex]===undefined){
//                 systemLogService.recordSystemLog("BE Server", `error: Websocket - all-status; 존재하지 않는 서버 값 수신 받음 -> ${JSON.stringify(msg)}`);
//                 if(config.dev)console.log(`\nerror: Websocket - all-status; 존재하지 않는 서버 값 수신 받음 -> ${msg}\n`);
//                 return;  
//             } 
//             systemLogService.recordSystemLog(SERVERS[serverIndex], `Websocket - 서버 상태 수신: {namespace: /all, eventName: status, message: ${JSON.stringify(msg)}}`);
//         });

//         socket.on(EVENT, async (msg)=>{ // 채널 이벤트 발생
//             // console.log(msg);
//             try{
//                 const data = msgEmitter(all, EVENT, msg);
//                 const id:number = Number(data.channel);
//                 const status:number = Number(data.status);
//                 if(isNaN(id) || isNaN(status)){
//                     throw new Error("(channel | status) is NaN!!");
//                 }

                
//                 if(status==1){ // on : interval start
//                     if(!data.time){ // 이벤트 ON -> time 필드 필수
//                         if(config.dev)console.log(`\nerror: Websocket - 이벤트 ON -> time 필드 누락: {namespace: /all, eventName: event, message: ${msg}}\n`);
//                         systemLogService.recordSystemLog("BE Server", `error: Websocket - 이벤트 ON -> time 필드 누락: {namespace: /all, eventName: event, message: ${msg}}`);
//                         return;
//                     }
//                     // if (!data.image){
//                     //     if(config.dev)console.log(`\nerror: Websocket - 이벤트 ON -> image 필드 누락: {namespace: /all, eventName: event, message: ${msg}}\n`);
//                     //     systemLogService.recordSystemLog("BE Server", `error: Websocket - 이벤트 ON -> image 필드 누락: {namespace: /all, eventName: event, message: ${msg}}`);
//                     //     return;

//                     // } 
//                     // time data check
//                     if(/^\d{12}$/.test(data.time)==false){
//                         if(config.dev)console.log("WebSocket - 수신한 time 형식 잘못됨");
//                         systemLogService.recordSystemLog("BE Server", `error: WebSocket - 수신한 time 형식 잘못됨: ${data.time}}`);
//                         return;
//                     }
//                     // 타이머 시작
//                     if(timeoutControllers[id]){
//                         // console.log(`[${id}] 기존 타이머 초기화...`);
//                         clearTimeout(timeoutControllers[id]);
//                     }
//                     channelInfoService.updateChannelStatusWithTime(id,status,data.time); // db 채널 상태 업데이트

//                     // console.log(data.time);
//                     // saveImage(id, data.image, data.time);
                    
//                     digitalIoSocketEmitter(id, 1);
//                     // Digital I/O Websocket 전달
//                     // digitalIoSocket.emit("message",{
//                     //     "PORTS":`${id}`,
//                     //     "DATA":`${status}`
//                     // });
//                     if(id>=1 && id<=config.number_on_channels){
//                         const channelInfo:ChannelInfo = await channelInfoService.getChannelInfo(id); // preset: 알림 시간 가져오기 위함
//                         if(channelInfo.preset!==0){ // preset===0이면 이벤트 자동 종료 비활성
//                             timeoutControllers[id] = setTimeout(async () => {
                                
//                                 // Digital I/O Websocket 전달
//                                 // digitalIoSocket.emit("message",{
//                                 //     "PORTS":`${id}`,
//                                 //     "DATA":`0`
//                                 // });
//                                 digitalIoSocketEmitter(id, 0);

                                
//                                 // cancelTimeout
//                                 msgEmitter(all, EVENT, {channel:id, status:0});
//                                 systemLogService.recordSystemLog("BE Server", `${id} 채널 이벤트 알림 종료됨`);
//                                 channelInfoService.updateChannelStatus(id,0); // 타이머 종료 -> 상태: 0

//                             }, channelInfo.preset * 1000); // preset: 초 단위
//                         }
//                     }
                    
//                 } 
//                 // 발생하지 않음 -> 대신 patch API -> cancelTimeout
//                 else if (status==0){ // status==0, off 날릴 때
//                     // console.log("잘못된 요청: status 0");
//                     // cancelTimeout(id); // 이벤트 알림(타이머) 종료
//                 } else{
//                     if(config.dev) console.log("잘못된 요청: wrong status value: "+status);
//                     systemLogService.recordSystemLog("BE Server", `error: Websocket - 잘못된 요청 수신; wrong status value: {namespace: /all, eventName: event, message: ${msg}}`);
//                 }
                
//                 // 응답 결과 시스템 로깅 필요
                
//             }catch(e){
//                 systemLogService.recordSystemLog("BE Server", `error: Websocket - number 타입이 아닌 channel or status 값: {namespace: /all, eventName: event, message: ${msg}}`);
//                 if(config.dev) console.log(`\nerror: Websocket - number 타입이 아닌 channel or status 값: {namespace: /all, eventName: event, message: ${msg}}\n`);
//             }
//         });
//     });
// }

// export function cancelTimeout(id:number){
//     try{
//         // channelInfoService.updateChannelStatus(id,0); // 타이머 종료 -> 상태: 0
//         systemLogService.recordSystemLog("BE Server", `${id} 채널 이벤트 알림 종료됨`);
//         if(timeoutControllers[id]){
//             clearTimeout(timeoutControllers[id]);
//             delete timeoutControllers[id]; // 타이머가 끝남으로 제거
//             // console.log("타이머 종료 요청");
//         }
//         msgEmitter(all, EVENT, {channel:id, status:0});
//         // Digital I/O Websocket 전달
//         // digitalIoSocket.emit("message",{
//         //     "PORTS":`${id}`,
//         //     "DATA":`0`
//         // });
//         digitalIoSocketEmitter(id, 0);

        
//     } catch(e){
//         if(config.dev)console.log("cancelTimeout Error!");
//         systemLogService.recordSystemLog("BE Server", `error: cancelTimeout Error; channel-id: ${id}`);
//     }
// }


// let is5on = 0;
// let is6on = 0;

// function digitalIoSocketEmitter(channel_id:number, status:number){ // 1호기
//     switch(channel_id){
//         case 1:
//         case 2:
//         case 3:
//             digitalIoSocket.emit("message",{
//                 "PORTS":`${channel_id}`,
//                 "DATA":`${status}`
//             });
//             break;
//         case 5:
//         case 6:
//             if(channel_id===5){
//                 is5on = status;
//             }else if (channel_id===6){
//                 is6on = status;
//             }
//             if(status===1){
//                 digitalIoSocket.emit("message",{
//                     "PORTS":`4`,
//                     "DATA":`1`
//                 });
                
//             } else if(is5on === 0 && is6on === 0){
                
//                 digitalIoSocket.emit("message",{
//                     "PORTS":`4`,
//                     "DATA":`0`
//                 });
                
//             }
//     }
// }
// /*
// function digitalIoSocketEmitter(channel_id:number, status:number){ // 2호기
//     let sendPort=-1;
//     switch(channel_id){
//         case 1:
//             sendPort = 9;
//             break;
//         case 2:
//             sendPort = 10;
//             break;
//         case 3:
//             sendPort = 11;
//             break;
//         case 5:
//             sendPort = 12;
//             break;
//     }
//     digitalIoSocket.emit("message",{
//         "PORTS":`${sendPort}`,
//         "DATA":`${status}`
//     });
// }
// */