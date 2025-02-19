export class BaseError extends Error {
    code
    isOperational=1
    constructor(data: { code: number, message: string }) {
        super(data.message)
        this.code = data.code;
    }
}