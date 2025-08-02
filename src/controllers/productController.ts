import logger from "../logger";
import { Request, Response } from "express";
import ProductManagement from "../services/productService";


export const getList = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json(await ProductManagement.getList(req.body));
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


