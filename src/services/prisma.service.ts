import { PrismaClient } from "@prisma/client"

export class PrismaService {
    static #instance: PrismaClient;
    // prisma : PrismaClient = new

    private constructor() { }

    public static get instance(): PrismaClient {
        if (!PrismaService.#instance) {
            PrismaService.#instance = new PrismaClient();
        }

        return PrismaService.#instance;
    }


}
