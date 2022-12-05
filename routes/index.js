import express from 'express';
import Replicate from 'replicate-js'

const router = express.Router();
const REPLICATE_API_TOKEN = 'c0dc69f33a52b78b742bc847a227225d255d6207';
const replicate = new Replicate({token: REPLICATE_API_TOKEN});
/* GET home page. */
router.get('/', async function (req, res, next) {

    res.send('ok');
});

export default router
