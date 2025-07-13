import logger from "../logger";
import { Request, Response } from "express";
import ReadDataFromWebService from "../services/readDataFromWebService.js";


export const extractDataFromChemSrc = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(await ReadDataFromWebService.extractDataFromChemSrc(req.body));
    } catch (err) {
        logger.info((err as Error).message);
        res.status(500);
    }
};
