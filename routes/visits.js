import express from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
/* GET users listing. */
router.get("/", function (req, res) {
  if (req.url === "/favicon.ico") {
    res.end();
  }
  // Ends request for favicon without counting

  const json = fs.readFileSync(
    path.join(path.dirname("count.json"), "count.json"),
    "utf-8"
  );
  const obj = JSON.parse(json);
  // Reads count.json and converts to JS object

  obj.pageviews = obj.pageviews + 1;
  console.log(req.query);
  if (req.query.type === "visit-pageview") {
    obj.visits = obj.visits + 1;
  }
  // Updates pageviews and visits (conditional upon URL param value)

  const newJSON = JSON.stringify(obj);
  // Converts result to JSON

  fs.writeFileSync("count.json", newJSON);
  res.send(newJSON);
  // Writes result to file and sends to user as JSON
});

export default router;
