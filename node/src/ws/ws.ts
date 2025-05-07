import { Server } from "socket.io";
import allNamespace from "./namespace/all.namespace";
import analysisNamespace from "./namespace/analysis.namespace";

let analysisNsp:any; // analysis namespace
let allNsp:any;

export default function registerNamespaces(io: Server){
    allNsp = allNamespace(io);
    analysisNsp = analysisNamespace(io);
}

export function getAnalysisNsp(){
    return analysisNsp;
};

export function getAllNsp(){
    return allNsp;
};
