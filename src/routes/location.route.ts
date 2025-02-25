import { countEvents, data, latestEvent, updateLocation } from '../controllers/location.controller';
import path from 'path';
import { EventDto } from '../interfaces/event.interface';
import { CustomRouter } from './base-router';
import { BadRequestExecption } from '../execptions/bad-request.execption';

const router = new CustomRouter();
// 
router.post("/update", async (req, res) => {
    await updateLocation(req.body)
    res.status(200).json()
})
router.get("/update", async (req, res) => {
    // latitude=1&longitude=1&timestamp=1&speed=1&battary=1&username
    await updateLocation(req.query as unknown as EventDto)
    res.status(200).json()
})

//  
router.get("/latest", async (req, res) => {
    const event = await latestEvent()
    res.status(200).json(event)
})
router.get("/count", async (req, res) => {
    const eventsCount = await countEvents()
    res.status(200).json({ count: eventsCount })
})
router.get("/data", async (req, res) => {
    const start = req.query.start as string
    const end = req.query.end as string
    const timezone = req.query.timezone as string;
    const allowedTimezones  = ["Asia/Damascus","Asia/Dubai"] 
    console.log(timezone, start, end)
    if (!start || !end || !timezone || timezone == "undefined" || !(allowedTimezones.includes(timezone))) {
        throw new BadRequestExecption({ message: "dates and timezone are requires" })
    }

    const ddata = await data(start, end, timezone)
    res.status(200).json({ count: ddata.length, "ddata": ddata })
})
// 



router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'index.html'));
});







export default router;





