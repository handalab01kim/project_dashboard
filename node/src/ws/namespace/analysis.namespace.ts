// import { Namespace, Server } from "socket.io";
// import msgEmitter from "../function/msgEmitter";
// import systemLogService from "../../domain/system-log/system-log.service";

// const MESSAGE:string = "message";

// export default function analysisNamespace(io: Server):any{
//     const analysis = io.of("/analysis");

//     analysis.on("connection", (socket)=>{
//         socket.on(MESSAGE, (msg)=>{
//             msgEmitter(analysis, MESSAGE, msg);
//         });
//     });

//     return analysis;
// }