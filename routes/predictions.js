import express from "express";
import Replicate from "replicate-js";
import { Sequelize, Model, DataTypes } from "sequelize";

const router = express.Router();
const REPLICATE_API_TOKEN = "";
const replicate = new Replicate({ token: REPLICATE_API_TOKEN });

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

console.log({ Prediction: Prediction.tableName });
const createColumn = ({ type, defaultValue, name }) => {
  queryInterface.addColumn("Predictions", name, {
    type,
    defaultValue,
  });
};

// createColumn({ type: DataTypes.NUMBER, defaultValue: 0, name: "visits" });
// createColumn({ type: DataTypes.NUMBER, defaultValue: 0, name: "pageViews" });
Prediction.update({ visits: 0, pageViews: 0 }, { where: {} });

/* GET home page. */
router.get("/", async function (req, res, next) {
  console.log("start prediction");
  await sequelize.sync();
  const predictions = await Prediction.findAll();
  console.log({ predictions });
  res.send(predictions);
});

router.get("/predict/:text", async function (req, res, next) {
  console.log("start prediction");
  await sequelize.sync();
  const model = await replicate.models.get(
    "cjwbw/stable-diffusion-high-resolution",
    "231e401da17b34aac8f8b3685f662f7fdad9ce1cf504ec0828ba4aac19f7882f"
  );
  console.log({
    model,
    text: req.params.text,
    params: JSON.stringify(req.params, null, 2),
  });
  const prediction = await model.predict({ prompt: req.params.text });
  console.log({ prediction });
  const resp = await Prediction.create({
    prompt: req.params.text,
    link: prediction,
  });
  console.log(resp.toJSON());
});

export default router;
