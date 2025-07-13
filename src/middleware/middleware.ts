import jwt, { JwtPayload } from 'jsonwebtoken';
import { TAuthorizationModel } from "../types/common.js";
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

        if (typeof decoded === 'object' && decoded !== null) {
            const auth_token: TAuthorizationModel = {
                userId: (decoded as JwtPayload).userId,
                emailId: (decoded as JwtPayload).emailId,
                mobileNumber: (decoded as JwtPayload).mobileNumber,
            };

            req.body = { ...req.body, auth_token };
        } else {
            res.status(401).send("Invalid JWT payload format");
            return;
        }

    } catch (err: any) {
        res.status(401).send("Invalid JWT token");
        return;
    }

    next();
};

export default authMiddleware;
