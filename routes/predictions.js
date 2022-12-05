import express from "express";
import {Configuration, OpenAIApi} from "openai";
import {DataTypes, Sequelize} from "sequelize";
import upload from '../middleware/file-upload.js'
import {FileApi} from '../services/file.js'

const router = express.Router();
const OPENAI_API_KEY = "";
const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sequelize = new Sequelize("sqlite::memory:", {
    dialect: "sqlite",
    storage: "./../database.sqlite",
});

const queryInterface = sequelize.getQueryInterface();
const Prediction = sequelize.define("Prediction", {
    prompt: DataTypes.STRING,
    link: DataTypes.STRING,
    visits: DataTypes.NUMBER,
    pageViews: DataTypes.NUMBER,
});

console.log({Prediction: Prediction.tableName});
const createColumn = ({type, defaultValue, name}) => {
    queryInterface.addColumn("Predictions", name, {
        type,
        defaultValue,
    });
};

// createColumn({ type: DataTypes.NUMBER, defaultValue: 0, name: "visits" });
// createColumn({ type: DataTypes.NUMBER, defaultValue: 0, name: "pageViews" });
Prediction.update({visits: 0, pageViews: 0}, {where: {}});

/* GET home page. */
router.get("/", async function (req, res, next) {
    console.log("start prediction");
    await sequelize.sync();
    const predictions = await Prediction.findAll();
    console.log({predictions});
    res.send(predictions);
});

router.get("/predict/:text", async function (req, res, next) {
    console.log("start prediction");
    await sequelize.sync();
    const response = await openai.createImage({
        prompt: req.params.text,
        n: 1,
        size: "1024x1024",
    });
    const image_url = response.data.data[0].url;
    const resp = await Prediction.create({
        prompt: req.params.text,
        link: image_url,
    });
    console.log(resp.toJSON());
    res.send({status: 'ok'});

});
router.post("/predict/create-edit", upload.array('images'), async function (req, res, next) {
    console.log("start prediction");
    if (!req.file) {
        res.status(401).json({error: 'Please provide an image'});
    }
    console.log({file: req.file});
    const imagePath = path.join(__dirname, '../public/images');

    await sequelize.sync();
    FileApi.save()

    const filename1 = await fileUpload.save(req.file.buffer[0]);
    const filename2 = await fileUpload.save(req.file.buffer[1]);
    // const response = await openai.createImageEdit({
    //     image:, mask: req
    //     prompt: req.params.text,
    //     n: 1,
    //     size: "1024x1024",
    // });
    // const image_url = response.data.data[0].url;
    const resp = await Prediction.create({
        prompt: req.params.text,
        link: image_url,
    });
    // console.log(resp.toJSON());
    return res.status(200).json({ name: filename });
    res.send({status: 'ok'});

});

export default router;
