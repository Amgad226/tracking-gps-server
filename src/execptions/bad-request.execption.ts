import { BaseError } from "../errors/base-error";

export class BadRequestExecption extends BaseError {
    constructor(data: { message: string }) {
        super({ code: 400, message: data.message })
    }
}