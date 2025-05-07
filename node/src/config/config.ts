import dotenv from "dotenv";
dotenv.config();

const localhostOrigin:string[] = ["http://localhost:3000", `http://localhost:${Number(process.env.PORT) || 4001}`];

const isDev:boolean = process.env.NODE_ENV === "development";
const isDeepLog:boolean = process.env.DEEP_LOG === "true";
const origins = isDev&&process.env.DEV_IP ? 
    String(process.env.DEV_IP).split(',').flatMap(ip => String(process.env.DEV_PORT).split(',').map(port => `http://${ip}:${port}`))
    .concat(localhostOrigin)
    : localhostOrigin;
// const rtsp_ports:number[] = process.env.RTSP_PORTS ? 
//     String(process.env.RTSP_PORTS).split(',').map(port => Number(port))
//     : [];
const config = {
    url: process.env.HOST || "localhost",
    port: Number(process.env.PORT) || 4001,
    dev: isDev, // default: prod
    deepLog: isDeepLog || false,
    
    // redis_session_maxAge_hour: Number(process.env.SESSION_HOUR) || 24, // redis-session 만료 시간 (미사용 시간)

    digital_io_socket: process.env.DIGITAL_IO_SOCKET,
    
    user: process.env.POSTGRES_USER || "handalab",
    pswd: process.env.POSTGRES_PASSWORD || "handalab",
    host: process.env.POSTGRES_HOST || "localhost",
    db: process.env.POSTGRES_DB || "nsk",
    db_port: Number(process.env.POSTGRES_PORT) || 5432,

    // redis_host: process.env.REDIS_HOST || "localhost",
    // redis_port: Number(process.env.REDIS_PORT) || 6379,
    // redis_pswd: process.env.REDIS_PASSWORD || '0000',
    // redis_secret: process.env.REDIS_SECRET_KEY || "handalab_nsk_secret_key",

    origins: origins,
    // rtsp_ports: rtsp_ports,

    number_on_channels: 6, // 채널 개수
};
export default config;