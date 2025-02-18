import { Request, Response } from 'express';
import { LocationRepo } from '../repositories/location.repository';
import { io, usersLocations } from '../app';
import { EventDto, EventToEmit } from '../interfaces/event.interface';
import { increaseNumberOfAllRecivedEvents, numberOfAllRecivedEvents } from '../utils/counter';



export const updateLocation = async (req: Request, res: Response): Promise<any> => {
    const { latitude, longitude, speed, battary, timestamp, username }: EventDto = req.body;
    const validateData = validateUpdateData({ latitude, longitude, speed, battary, timestamp, username })

    if (!validateData) {
        return res.status(400).json({ message: 'Invalid data provided' });
    }

    increaseNumberOfAllRecivedEvents()
    const newLocation: EventToEmit = { latitude: parseFloat(latitude), longitude: parseFloat(longitude), batt: battary, time: timestamp, s: speed, numberOfAllRecivedEvents };
    const repo = new LocationRepo()
    repo.store({ ...newLocation, username: username })

    // STEP Update location in user map 
    usersLocations[username] = (newLocation);

    //STEP emit to socket new changes
    io.to("samsuang").emit("locationUpdate", newLocation);



    res.status(200).json(newLocation)
}



const validateUpdateData = (data: EventDto): boolean|EventDto => {
    // Check if all required fields are provided and valid
    if (!data.latitude || !data.longitude || !data.username) {
        return false; // Invalid data, return false
    }

    // Additional validation for numerical fields can be added here
    if (isNaN(parseFloat(data.latitude)) || isNaN(parseFloat(data.longitude))) {
        return false; // Invalid latitude or longitude
    }

    if(data.speed){
        if (isNaN(parseFloat(data.speed))) {
            return false; // Invalid speed
        }
    }

    return data; // All validations passed
};