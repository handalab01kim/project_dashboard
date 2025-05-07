import fs from "fs";
import path from "path";
// 이미지 저장: /node/public/images/..
export default function saveImage(channel:number, base64Data:any, timeString:any){
    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(__dirname, `../../../save/${channel}/${timeString}.jpg`);

    // 폴더 없을 경우 생성
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // 저장
    fs.writeFileSync(filePath, buffer);
}
