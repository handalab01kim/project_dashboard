import HttpError, {CommonError} from "../errors/http-error";

// dateFormatter-> returns "0000-00-00"
export default function (time:string):string{
/*
{
    "time": "2025-03-27T23:22:20.285Z"
}
*/
    if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d*Z$/.test(time)) {
        return new Date(time)
        .toLocaleDateString('ko-KR', { 
            // timeZone: 'Asia/Seoul' // DB 서버 측 timeZone이 이미 Asia/Seoul, 옵션 사용 시 시간 다시 바뀜
        })
        .split('.')
        .map(num => num.trim().padStart(2, '0'))
        .slice(0, -1)
        .join('-');
    }
/*
{
    "time": "2025-03-28"
}
*/
    if(/^\d{4}-\d{2}-\d{2}$/.test(time))
        return time;

    throw new HttpError(CommonError.INTERNAL_SERVER_ERROR, "time-formatter: invalid time/date value - "+ time);
};



// "0000. 00. 00. 00:00:00" → "0000-00-00 00:00:00"
export function timeFormatter(dateTime: string|Date):string{
    console.log(typeof dateTime);
    if(typeof dateTime === "string"){
        if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d*Z$/.test(dateTime)){
            dateTime = new Date(dateTime);
        } else {
            throw new HttpError(CommonError.INTERNAL_SERVER_ERROR, "time-formatter: invalid time value - "+ dateTime);
        }
    }

    if (dateTime instanceof Date) {
        const formatted = dateTime.toLocaleString('ko-KR', {
            // timeZone: 'Asia/Seoul', // DB 서버 측 timeZone이 이미 Asia/Seoul, 옵션 사용 시 시간 다시 바뀜
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        // "0000. 00. 00. 00:00:00" → "0000-00-00 00:00:00"
        const dateString = formatted.slice(0,13)
            .split('.')
            .map(num => num.trim().padStart(2, '0'))
            .slice(0, -1)
            .join('-');
        const timeString = formatted.slice(13);

        return dateString + timeString;
    }
    throw new HttpError(CommonError.INTERNAL_SERVER_ERROR, "time-formatter: invalid time value - "+ dateTime);
}

// "0000-00-00" 형태인지 검사
export function isDate(date:string){
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function dateFormatterForDate(date:any){
    return new Date(date)
        .toLocaleDateString('ko-KR', { 
            // timeZone: 'Asia/Seoul' // DB 서버 측 timeZone이 이미 Asia/Seoul, 옵션 사용 시 시간 다시 바뀜
        })
        .split('.')
        .map(num => num.trim().padStart(2, '0'))
        .slice(0, -1)
        .join('-');
}

