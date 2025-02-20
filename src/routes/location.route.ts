import { countEvents, data, latestEvent, updateLocation } from '../controllers/location.controller';
import path from 'path';
import { EventDto } from '../interfaces/event.interface';
import { CustomRouter } from './base-router';

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
    res.status(200).json({count:eventsCount})
})
router.get("/data", async (req, res) => {
    const ddata = await data()
    res.status(200).json({count : ddata.length,"ddata":ddata})
})
// 


router.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'index.html'));
});
router.get('/tracking', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '..','..', 'static', 'tracking.html'));
});







export default router;





