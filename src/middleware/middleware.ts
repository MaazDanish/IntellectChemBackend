const jwt = require("jsonwebtoken");
import { TAuthorizationModel } from "../types/common";
import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).send("Authorization header is missing");
        return;
    }
    const token = authHeader.split(" ")[1];


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);

        const auth_token: TAuthorizationModel = {
            userId: decoded.userId,
            emailId: decoded.emailId,
            mobileNumber: decoded.mobileNumber,
        };

        req.body = { ...req.body, auth_token };
    } catch (err: any) {
        res.status(401).send("Invalid jwt Token");
        return;
    }

    next();
};

export default authMiddleware;
