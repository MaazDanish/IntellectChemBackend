import logger from "../logger";
import CommonUtils from "../utils/common";
import { Request, Response } from "express";
import { eReturnCodes } from "../enums/commonEnums";
import UserManagement from "../services/userService";
import { validationResult } from "express-validator";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await UserManagement.getUsers(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};
export const addEditUser = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await UserManagement.addEditUser(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};

export const signIN = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const data = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
      data.description = errors.array()[0].msg;
      res.status(200).json({ data });
      return;
    } else {
      res.json(await UserManagement.signIN(req.body));
    }
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};


export const signUP = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const data = CommonUtils.getDataResponse(eReturnCodes.R_INVALID_REQUEST);
      data.description = errors.array()[0].msg;
      res.status(200).json({ data });
      return;
    } else {
      res.json(await UserManagement.signUP(req.body));
    }
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};


export const getSpecificUser = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await UserManagement.getSpecificUser(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};
export const editUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await UserManagement.editUserDetails(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};


