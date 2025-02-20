import { EventToEmit, EventDto, EventDb } from '../interfaces/event.interface';
import { PrismaService } from '../services/prisma.service';

export interface ReturnedEvnet extends Pick<EventDb, "user" | "battary" | "speed" | "long" | "lat" | "time"> { }
export class LocationRepo {
    constructor() {
    }
    async findLatestByName(name: string): Promise<ReturnedEvnet | null> {
        return await PrismaService.instance.event.findFirst({
            orderBy: { createdAt: 'desc' }, where: { user: "samsung" },
            select: { lat: true, long: true, speed: true, battary: true, time: true, user: true }

        })
    }
    async latest(): Promise<ReturnedEvnet | null> {
        return await PrismaService.instance.event.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { lat: true, long: true, speed: true, battary: true, time: true, user: true }

        })
    }
    async count(): Promise<any> {
        return await PrismaService.instance.event.count({

        })
    }
    async data(): Promise<ReturnedEvnet[]> {
        return await PrismaService.instance.event.findMany({
            where: { id:{gt:6950} },
            select: { lat: true, long: true, speed: true, battary: true, time: true, user: true }

        })
    }

    // 5097 4701
    async store(data: EventDto): Promise<ReturnedEvnet> {
        const date = new Date(data.timestamp); // Convert to Date object
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are 0-based
        const year = date.getFullYear();

        let hour = date.getHours();

        return await PrismaService.instance.event.create({
            data: {
                battary: data.GPSLogger ? data.battary.toString() : (Math.round(data.battary * 100)).toString(),
                lat: data.latitude.toString(),
                long: data.longitude.toString(),
                speed: (data.speed < 0) ? "0" : (Math.round(data.speed) * 3.6).toString(),
                time: data.timestamp.toString(),
                user: "samsung",

                day,
                hour,
                month,
                year,
            },
            select: { lat: true, long: true, speed: true, battary: true, time: true, user: true }
        })
    }
}

