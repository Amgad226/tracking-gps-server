import { BaseError } from "./base-error";

class ErrorHandler {
    public async notify(err: Error): Promise<void> {
        console.error(
            'Notify',err.message
        );
    }
    public async handleError(err: Error): Promise<void> {
        console.error('ErrorHandler:',err.message);
    }

    public isTrustedError(error: Error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}
export const errorHandler = new ErrorHandler();