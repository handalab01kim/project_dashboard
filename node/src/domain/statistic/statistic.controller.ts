import {Request, Response, NextFunction} from "express";
import HttpError from "../../types/http-error";
import taskService from "./statistic.service";
import Statistic from "./types/statistic";

async function getStatistic(req:Request, res:Response, next: NextFunction){
    try{
        // const week:number = Number(req.params.week);
        const statistics:Statistic = await taskService.getStatistic();
        res.status(200).json(statistics);
    } catch(e){
        next(e);
    }
}


export default {
    getStatistic,
};
