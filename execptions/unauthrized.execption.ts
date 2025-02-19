import { BaseError } from "../src/errors/base-error";

export class UnauthrizedExecption extends BaseError {
    constructor(data: { message: string }) {
        super({ code: 401, message: data.message })
    }
}