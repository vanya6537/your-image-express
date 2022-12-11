import express from "express";
import {Configuration, OpenAIApi} from "openai";
import {DataTypes, Sequelize} from "sequelize";
import {v4 as uuidv4} from 'uuid';
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sequelize = new Sequelize("sqlite::memory:", {
    dialect: "sqlite",
    storage: `${__dirname.replace('routes','')}database.sqlite`,
});


const queryInterface = sequelize.getQueryInterface();
const Prediction = sequelize.define("Predictions", {
    prompt: DataTypes.STRING,
    filename: DataTypes.STRING,
    visits: DataTypes.NUMBER,
    pageViews: DataTypes.NUMBER,
    fileSlug: DataTypes.STRING,
});

router.get("/", async function (req, res, next) {
    console.log("start prediction");
    await sequelize.sync();
    const predictions = await Prediction.findAll();
    // predictions.forEach(async (p)=>{
    //     if(!p.filename ||p.id ===40)
    //         return await p.destroy();
    // })
    await sequelize.sync();

    let predictionsImageByteData = predictions.map(({
                                                        filename,
                                                        prompt,
                                                        id,
                                                        createdAt,
                                                        visits,
                                                        pageViews
                                                    }) => ({
        prompt,
        id,
        link: `http://localhost:3000/images/${filename}`,
        createdAt,
        visits,
        pageViews
    }))

    console.log({dirname:__dirname})
    res.send(predictionsImageByteData);

    await next();
});

router.get("/predict/:text", async function (req, res, next) {
    console.log("start prediction");
    await sequelize.sync();
    const response = await openai.createImage({
        prompt: req.params.text,
        n: 1,
        size: "1024x1024",
        response_format: 'b64_json'
    });
    const image_data = response.data.data[0].b64_json;
    const fileSlug = uuidv4();

    const filename = `${req.params.text.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${fileSlug}.jpeg`;

    try {
        await fs.writeFile(__dirname.replace('routes','')+`public/images/${filename}`, Buffer.from(image_data, 'base64'),{ flag: 'w' }, async () => {
            const resp = await Prediction.create({
                prompt: req.params.text,
                filename,
                fileSlug,
                visits: 0,
                pageViews: 0
            });
            resp.update()
            res.send({status: 'ok'});
        });
    } catch (e) {
        res.send({status: "Internal error ", message: e.message})
    }


});
// router.post("/predict/create-edit", upload.array('images'), async function (req, res, next) {
//     console.log("start prediction");
//     if (!req.file) {
//         res.status(401).json({error: 'Please provide an image'});
//     }
//     console.log({file: req.file});
//     const imagePath = path.join(__dirname, '../public/images');
//
//     await sequelize.sync();
//     FileApi.save()
//
//     const filename1 = await fileUpload.save(req.file.buffer[0]);
//     const filename2 = await fileUpload.save(req.file.buffer[1]);
//     // const response = await openai.createImageEdit({
//     //     image:, mask: req
//     //     prompt: req.params.text,
//     //     n: 1,
//     //     size: "1024x1024",
//     // });
//     // const image_url = response.data.data[0].url;
//     const resp = await Prediction.create({
//         prompt: req.params.text,
//         link: image_url,
//     });
//     // console.log(resp.toJSON());
//     return res.status(200).json({ name: filename });
//     res.send({status: 'ok'});
//
//     await next()
// });

export default router;
