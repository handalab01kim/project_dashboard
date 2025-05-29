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

    user: process.env.POSTGRES_USER || "handalab",
    pswd: process.env.POSTGRES_PASSWORD || "handalab",
    host: process.env.POSTGRES_HOST || "localhost",
    db: process.env.POSTGRES_DB || "nsk",
    db_port: Number(process.env.POSTGRES_PORT) || 5432,

    origins: origins,

};
export default config;