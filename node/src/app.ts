import express, {Express} from "express";
import cors from "cors";
import router from "./api";
import logger from "./middleware/logger";
import config from "./config/config";
import exceptionHandler from "./middleware/exception-handler";
// import redisSession from "./config/redis-session";
import path from "path";
import fs from "fs";

const app:Express = express();

// React 빌드 serve
app.use(express.static(path.join(__dirname, "..", "public", "build"))); 

// 미들웨어 & 라우터 등록
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const origins = config.origins;
app.use(cors({
    origin: origins,
    credentials: true, // for session-coockie
}));
// app.use(redisSession);

if(config.dev){ // dev 모드
    app.use(logger);
    console.log("Dev-Mode");
    // console.log("Allowed Origin: ", origins);
}
// session-filter: api 개별 적용
app.use("/api", router);
// app.get("/", (req, res)=>{
//     res.send("Typescript Server Is Running!");
// });

app.use(exceptionHandler);

// GET history images 
app.get('/image/:channel/:date', (req, res) => {
    const { channel, date } = req.params;
    const filePath = path.join(__dirname, "..", "..", "save", channel, `${date}.jpg`);
    // 파일 존재 여부 확인
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('이미지를 찾을 수 없습니다.');
    }
});

// 모든 요청에 대해 React 앱의 index.html 파일을 반환
// React Router가 사용된 경우, client-side routing을 지원하기 위해 모든 요청을 index.html로 라우팅
app.get('*', (req, res) => {
  // console.log("TEST");
    res.sendFile(path.join(__dirname, "..", "public", "build", "index.html"));
});


export default app;