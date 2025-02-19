import { BaseError } from "../errors/base-error";

export class ForbiddenExecption extends BaseError {
    constructor(data: { message: string }) {
        super({ code: 403, message: data.message })
    }
}