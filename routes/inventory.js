const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { PORT, BACKEND_URL } = process.env;

// // Read data file
// function readVideos() {
//     const videoData = fs.readFileSync("./data/warehouse.json");
//     const parsedData = JSON.parse(videoData);
//     return parsedData;
// }

// // Write data file
// function writeVideos(data){
//     fs.writeFileSync("./data/inventory.json", JSON.stringify(data));
// }

// // Get condensed list of video information
// router.route("/")
//     .get((req, res) => {
//         console.log("warehouse posting endpoint");
//         res.status(200).send("inventory posting endpoint");
//     })
//     .post((req, res) => {
//         console.log("warehouse posting endpoint");
//         res.status(200).send("inventory posting endpoint");;
//     });

module.exports = router;
