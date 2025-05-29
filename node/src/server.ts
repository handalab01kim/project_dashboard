import app from "./app"; // API app
import config from './config/config';

import http from "http";

const server = http.createServer(app);

const port:number = config.port;
server.listen(port, "0.0.0.0", ()=>{
    console.log(`listening ${port}`);
});