import { EventToEmit, EventDto, EventDb } from '../interfaces/event.interface';
import { PrismaService } from '../services/prisma.service';
import moment from "moment-timezone";

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
            select: { id:true,lat: true, long: true, speed: true, battary: true, time: true, user: true }

        })
    }
    async count(): Promise<any> {
        return await PrismaService.instance.event.count({

        })
    }
    async data(start:string,end:string,timezone:string): Promise<ReturnedEvnet[]> {
        const startUtc = moment.tz(start,timezone).utc().toDate()
        const endUtc = moment.tz(end,timezone).utc().toDate()
        console.log(timezone,startUtc,endUtc);


        return await PrismaService.instance.event.findMany({
            where: { 
                createdAt: {
                    gte: startUtc, 
                    lte: endUtc,
                }
            },
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
                battary: data.GPSLogger ? parseFloat(data.battary) : (Math.round(parseFloat(data.battary) * 100)),
                lat: parseFloat(data.latitude),
                long: parseFloat(data.longitude),
                speed: (parseFloat(data.speed) < 0) ? 0 : (Math.round(parseFloat(data.speed)) * 3.6),
                time: data.timestamp,
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

