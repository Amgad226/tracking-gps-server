import { NextFunction } from "express";
import { BaseError } from "../errors/base-error";
import { errorHandler } from "../errors/error-handler";

export const handleErrors = async (err: BaseError, req: Request | any, res: Response | any, next: NextFunction) => {
    if (!errorHandler.isTrustedError(err)) {
        errorHandler.notify(err)
        res.status(500).json({ message: "something went wrong contact the suppurt please" })

    } else {

        await errorHandler.handleError(err);
        res.status(err.code).json({ err: 1, message: err.message })
    }
}