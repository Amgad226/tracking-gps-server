import { LocationRepo } from '../repositories/location.repository';
import { io } from '../app';
import { EventDto } from '../interfaces/event.interface';
import { increaseNumberOfAllRecivedEvents, numberOfAllRecivedEvents } from '../utils/counter';
import { BadRequestExecption } from '../../execptions/bad-request.execption';



export const updateLocation = async (data: EventDto): Promise<void> => {

    const validateData = validateUpdateData(data)

    if (!validateData) {
        throw new BadRequestExecption({ message: "invalid data provided" })
    }

    
    console.log(`${numberOfAllRecivedEvents} : latitude:${data.latitude} ,longitude:${data.longitude} , battery:${data.battary},time:${data.timestamp},username:${data.username} `)
    console.log()

    increaseNumberOfAllRecivedEvents()

    const repo = new LocationRepo();
    const storedEvnet=await repo.store(data)


    //STEP emit to socket new changes
    io.to("samsuang").emit("locationUpdate", {...storedEvnet,numberOfAllRecivedEvents});

}



const validateUpdateData = (data: EventDto): boolean | EventDto => {
    // Check if all required fields are provided and valid
    if (!data.latitude || !data.longitude || !data.username) {
        return false; // Invalid data, return false
    }

    // Additional validation for numerical fields can be added here
    if (isNaN(parseFloat(data.latitude as unknown as string)) || isNaN(parseFloat(data.longitude as unknown as string))) {
        return false; // Invalid latitude or longitude
    }

    if (data.speed) {
        if (isNaN(parseFloat(data.speed as unknown as string))) {
            return false; // Invalid speed
        }
    }

    return data; // All validations passed
};