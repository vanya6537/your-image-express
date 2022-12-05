import express from "express";
import Replicate from "replicate-js";
import { Sequelize, Model, DataTypes } from "sequelize";

const router = express.Router();
const REPLICATE_API_TOKEN = "c0dc69f33a52b78b742bc847a227225d255d6207";
const replicate = new Replicate({ token: REPLICATE_API_TOKEN });

const sequelize = new Sequelize("sqlite::memory:", {
  dialect: "sqlite",
  storage: "./../database.sqlite",
});

const Prediction = sequelize.define("Prediction", {
  prompt: DataTypes.STRING,
  link: DataTypes.STRING,
  visits: DataTypes.NUMBER,
  pageViews: DataTypes.NUMBER,
});

await sequelize.sync();

await Prediction.update(
  { visits: 0, pageViews: 0 },
  {
    where: {
      visits: null,
    },
  }
);
// Prediction.findAll().then((items) => {
//   for (const item of items) {
//     if (!item.visits) {
//       item.visits(0);
//     }
//   }
// });
