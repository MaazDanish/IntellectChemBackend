import logger from "../logger";
import CommonUtils from "../utils/common";
import { Request, Response } from "express";
import { eReturnCodes } from "../enums/commonEnums";
import { validationResult } from "express-validator";
import ProductManagement from "../services/productService";

export const getList = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const data = CommonUtils.getDataResponse(eReturnCodes.R_INVALID_REQUEST);
      data.description = errors.array()[0].msg;
      res.status(200).json({ dataResponse: data, data: [] });
      return;
    } else {
      res.json(await ProductManagement.getList(req.body, req));
    }
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};

export const editProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await ProductManagement.editProductById(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};


export const deleteProductRawsByIds = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await ProductManagement.deleteProductRawsByIds(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};



export const getSpecificRawById = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await ProductManagement.getSpecificRawById(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};
export const storeSynonymData = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await ProductManagement.storeSynonymData(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};
export const getGraphData = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await ProductManagement.getGraphData(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};
export const getSearchHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await ProductManagement.getSearchHistory(req.body));
  } catch (err) {
    logger.info((err as Error).message);
    res.status(500);
  }
};


export const excelUpload = async (req: Request, res: Response): Promise<void> => {
  try {

    if (!req.file) {
      throw new Error("No file uploaded");
    }
    const reqbody = req.body;
    const reqfile = req.file;
    const reqMerge = { ...reqbody, ...reqfile };

    res.json(await ProductManagement.uploadExcel(reqMerge, req));
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).json({ message: (err as Error).message });
  }
};


