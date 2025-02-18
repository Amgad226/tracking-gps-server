import { PrismaClient } from '@prisma/client';
import { EventDto, EventToEmit } from '../interfaces/event.interface';
import { PrismaService } from '../services/prisma.service';


export class LocationRepo {
    constructor() {
    }
    async store(data: EventToEmit & {username:string}) {
        // await dbStoreEvent(data)
        const date = new Date(data.time as string); // Convert to Date object
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are 0-based
        const year = date.getFullYear();

        let hour = date.getHours();

        PrismaService.instance.event.create({
            data: {
                battary: data.batt as string,
                lat: data.latitude?.toString(),
                long: data.longitude?.toString(),
                speed: data.s as string,
                time: data.time as string,
                user: data.username,

                day,
                hour,
                month,
                year,
            }
        })
    };
}

