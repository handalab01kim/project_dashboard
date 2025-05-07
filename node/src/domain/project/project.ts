export default interface Project {
    id: number;
    name: string;
    client: string;
    step: string;
    period: string;
    content: string;

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