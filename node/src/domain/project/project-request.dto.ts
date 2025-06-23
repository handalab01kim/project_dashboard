import ProjectHistory from "../project-history/project-history.dto";
export default interface RequestProject {
    idx?: number;
    name?: string;
    client?: string;
    step?: string;
    start_date?: string;
    end_date?: string;
    leader?: string;
    client_assignee?: string;
    histories?: string[];

    // color?: number;
}

// export function channelInfoTypeCheck(obj:any):obj is ChannelInfo{ // 타입 가드
//     return (
//         typeof obj === 'object' &&
//         (!obj.name || typeof obj.name === 'string') &&
//         (!obj.description || typeof obj.description === 'string') &&
//         (!obj.timeset || typeof obj.timeset === 'number') &&
//         (!obj.preset || typeof obj.preset === 'number') &&
//         (!obj.rtspurl || typeof obj.rtspurl === 'string') &&
//         (!obj.roi || typeof obj.roi === 'string') &&
//         (!obj.pixel || typeof obj.pixel === 'number')
//     );
// }