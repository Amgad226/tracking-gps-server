import { EventToEmit, EventDto, EventDb } from '../interfaces/event.interface';
import { PrismaService } from '../services/prisma.service';


export class LocationRepo {
    constructor() {
    }
    async findLatestByName(name: string): Promise<Pick<EventDb, "user" | "battary" | "speed" | "long" | "lat" | "time"> | null> {
        return await PrismaService.instance.event.findFirst({
            orderBy: { id: 'desc' }, where: { user: name },
            select: { lat: true, long: true, speed: true, battary: true, time: true, user: true }

        })
    }

    async store(data: EventDto): Promise<Pick<EventDb, "user" | "battary" | "speed" | "long" | "lat" | "time">> {
        const date = new Date(data.timestamp); // Convert to Date object
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are 0-based
        const year = date.getFullYear();

        let hour = date.getHours();

        return await PrismaService.instance.event.create({
            data: {
                battary: data.GPSLogger ? data.battary.toString()  : (Math.round(data.battary * 100)).toString() ,
                lat: data.latitude,
                long: data.longitude,
                speed: data.speed ,
                time: data.timestamp,
                user: data.username,

                day,
                hour,
                month,
                year,
            },
            select: { lat: true, long: true, speed: true, battary: true, time: true, user: true }
        })
    }
}

