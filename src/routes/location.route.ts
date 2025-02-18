import { Router } from 'express';
import { updateLocation } from '../controllers/location.controller';
import path from 'path';

const router = Router();

router.post("/update", updateLocation)


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'index.html'));
});





export default router;





