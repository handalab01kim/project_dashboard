// module.exports = {
//   apps: [
//     {
//       name: "projects",
//       script: "node_modules/.bin/nodemon",
//       args: "--legacy-watch --watch src/**/*.ts --exec ts-node src/server.ts",
//       watch: ["src/**/*.ts"],
//       env: {
//         NODE_ENV: "development",
//       },
//       output: '../../logs/pm2/console.log', // 로그 출력 경로 재설정
//       error: '../../logs/pm2/console.error', // 에러 로그
//     }
//   ]
// };
// module.exports = {
//   apps: [
//     {
//       name: "projects",
//       script: "node_modules/.bin/nodemon.cmd",
//       args: "--legacy-watch --watch src/**/*.ts --exec ts-node src/server.ts",
//       interpreter: "cmd.exe", // Windows 호환을 위해 필요?
//       // interpreter: "powershell.exe", // Windows 호환을 위해 필요?
//       watch: ["src/**/*.ts"],
//       env: {
//         NODE_ENV: "development",
//       },
//       output: '../../logs/pm2/console.log', // 로그 출력 경로 재설정
//       error: '../../logs/pm2/console.error', // 에러 로그
//     }
//   ]
// };
// module.exports = {
//   apps: [
//     {
//       name: "projects",
//       script: "node_modules/.bin/ts-node.cmd",  // `.cmd`
//       args: "src/server.ts",
//       interpreter: "cmd.exe",
//       env: {
//         NODE_ENV: "development"
//       },
//       output: '../../logs/pm2/console.log',
//       error: '../../logs/pm2/console.error',
//     }
//   ]
// };
