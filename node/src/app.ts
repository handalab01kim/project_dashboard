import express, {Express} from "express";
import cors from "cors";
import router from "./api";
import logger from "./middleware/logger";
import config from "./config/config";
import exceptionHandler from "./middleware/exception-handler";
import path from "path";

const app:Express = express();

// React 빌드 serve
app.use(express.static(path.join(__dirname, "..", "public", "build")));

// 미들웨어 & 라우터 등록
if(config.dev){ // dev 모드
    app.use(logger);
    console.log("Dev-Mode");
    // console.log("Allowed Origin: ", origins);
} // logger을 가장 먼저 등록해야 parser 등의 라우터 에러도 일관성 있게 로깅 가능

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: "*",
}));


app.use("/api", router);
// app.get("/", (req, res)=>{
//     res.send("Typescript Server Is Running!");
// });

app.use(exceptionHandler);


// 모든 요청에 대해 React 앱의 index.html 파일을 반환
// React Router가 사용된 경우, client-side routing을 지원하기 위해 모든 요청을 index.html로 라우팅
app.get('*', (req, res) => {
  // console.log("TEST");
    res.sendFile(path.join(__dirname, "..", "public", "build", "index.html"));
});


export default app;