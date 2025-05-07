import HttpError from "../../types/http-error";
import projectRepository from "./project.repository";
import Project from "./project";

async function getProjects():Promise<Project[]>{
    const projects:Project[] = await projectRepository.getProjects();
    return projects;
}


export default {
    getProjects,
};

// async function getChannelInfo(id:number):Promise<ChannelInfo>{
//     const channelInfo:ChannelInfo = await projectRepository.getChannelInfo(id);
//     if(!channelInfo) throw new HttpError(404, "Not Found", "Invalid channel ID");
//     return channelInfo;
// }

// async function updateChannelInfo(id:number, requestDTO:ChannelInfo):Promise<ChannelInfo>{
//     if(requestDTO.id) throw new HttpError(400, "Bad Request", "cannot change channel-ID"); // id는 변경 불가

//     // const originalChannelInfo:ChannelInfo = await projectRepository.getChannelInfo(id);
//     // if(!originalChannelInfo) throw new HttpError(404, "Not Found", "Invalid channel ID");
//     // const originalRtspUrl:string = originalChannelInfo.rtspurl; // 기존 rtspurl

//     const channelInfo:ChannelInfo = await projectRepository.updateChannelInfo(id, requestDTO);
//     if(!channelInfo) throw new HttpError(400, "Bad Request", "Invalid channel ID"); // Dead Code?
//     // const newRtspUrl:string = channelInfo.rtspurl; // 변경된 rtspurl
//     // if(originalRtspUrl !== newRtspUrl){ // Rtsp 변경 시
//         updateRtspUrl(channelInfo); // 해당 Rtsp Stream 재시작
//     // }

//     systemLogService.recordSystemLog("BE Server", `${id} 채널 정보 변경됨: `+JSON.stringify(requestDTO));
//     return channelInfo;
// }




// async function getAllChannelStatus():Promise<ChannelStatus[]>{
//     const channelStatuses:ChannelStatus[] = await channelInfoRepository.getAllChannelStatus();
//     return channelStatuses;
// }

// async function getChannelStatus(id:number):Promise<ChannelStatus>{
//     const channelStatus:ChannelStatus = await channelInfoRepository.getChannelStatus(id);
//     if(!channelStatus) throw new HttpError(404, "Not Found", "Invalid channel ID");
//     return channelStatus;
// }

// function getEventNameById(id:number):string{
//     switch(id){
//         case 1:
//             return "제품 미투입 감지";
//         case 2:
//             return "제품 미투입 감지";
//         case 3:
//             return "제품 잔품 감지";
//         case 4:
//             return "제품 초품 감지";
//         case 5:
//             return "제품 과다 적재 감지";
//         case 6:
//             return "화면 변화 감지";
//         default:
//             return `${id}채널 이벤트 감지`;
//     }
// }

// async function updateChannelStatus(id:number,status:number):Promise<ChannelStatus>{
//     const channelStatus:ChannelStatus = await channelInfoRepository.updateChannelStatus(id,status);
//     if(!channelStatus) throw new HttpError(400, "Bad Request", "Invalid channel ID");

//     const {name} = await channelInfoRepository.getChannelNameById(id); // 채널 이름
//     if(status==1){
//         historyService.recordEvents(id,getEventNameById(id));
//     } else{
//         historyService.recordEvents(id,`${name} 알림 해제`);
//     }
//     return channelStatus;
// }

// async function updateChannelStatusWithTime(id:number,status:number, timeString:string):Promise<ChannelStatus>{
//     const channelStatus:ChannelStatus = await channelInfoRepository.updateChannelStatus(id,status);
//     if(!channelStatus) throw new HttpError(400, "Bad Request", "Invalid channel ID");

//     const {name} = await channelInfoRepository.getChannelNameById(id); // 채널 이름
//     if(status==1){
//         historyService.recordEventsWithTime(id,getEventNameById(id), timeString);
//     } else{
//         historyService.recordEvents(id,`${name} 알림 해제`);
//     }
//     return channelStatus;
// }

