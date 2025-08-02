
import logger from "../logger";
import { Request, Response } from "express";
import EmailServiceManagement from "../services/emailService";

export const scheduleDemo = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(await EmailServiceManagement.scheduleDemo(req.body));
    } catch (err) {
        logger.info((err as Error).message);
        res.status(500).send("Server Error");
    }
};


export const contactUsEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(await EmailServiceManagement.contactUsEmail(req.body));
    } catch (err) {
        logger.info((err as Error).message);
        res.status(500).send("Server Error");
    }
};
export const subscribeEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(await EmailServiceManagement.subscribeEmail(req.body));
    } catch (err) {
        logger.info((err as Error).message);
        res.status(500).send("Server Error");
    }
};

export const getSubscriberEmailList = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(await EmailServiceManagement.getSubscriberEmailList(req.body));
    } catch (err) {
        logger.info((err as Error).message);
        res.status(500).send("Server Error");
    }
};
export const getScheduleDemoList = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(await EmailServiceManagement.getScheduleDemoList(req.body));
    } catch (err) {
        logger.info((err as Error).message);
        res.status(500).send("Server Error");
    }
};
export const getContactUsList = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json(await EmailServiceManagement.getContactUsList(req.body));
    } catch (err) {
        logger.info((err as Error).message);
        res.status(500).send("Server Error");
    }
};