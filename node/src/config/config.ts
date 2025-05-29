import dotenv from "dotenv";
dotenv.config();

const isDev:boolean = process.env.NODE_ENV === "development";
const isDeepLog:boolean = process.env.DEEP_LOG === "true";
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

};
export default config;