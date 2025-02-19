import { updateLocation } from '../controllers/location.controller';
import path from 'path';
import { EventDto } from '../interfaces/event.interface';
import { CustomRouter } from './base-router';

const router = new CustomRouter();

router.post("/update", async (req, res) => {
    await updateLocation(req.body)
    res.status(200).json()
})
router.get("/update", async (req, res) => {
    // latitude=1&longitude=1&timestamp=1&speed=1&battary=1&username
    await updateLocation(req.query as unknown as EventDto)
    res.status(200).json()
})


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'index.html'));
});





export default router;





