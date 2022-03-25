const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
const { PORT, BACKEND_URL } = process.env;

// // Read data file
function readInventory() {
  const videoData = fs.readFileSync("./data/inventories.json");
  const parsedData = JSON.parse(videoData);
  return parsedData;
}

// // Write data file
function writeInventory(data) {
  fs.writeFileSync("./data/inventories.json", JSON.stringify(data));
}

// // Get condensed list of video information
router
  .route("/")
  .get((req, res) => {
    console.log("inventory posting endpoint");
    res.status(200).send("inventory posting endpoint");
  })
  .post((req, res) => {
    console.log("inventory posting endpoint");
    res.status(200).send("inventory posting endpoint");
  });

router.route("/:id").delete((req, res) => {
  const inventory = readInventory();
  const { id } = req.params;
  const finalInventorylist = inventory.filter((inventoryID) => {
    return inventoryID.id !== id;
  });

  finalInventorylist.length !== inventory.length
    ? (res.status(200).send(finalInventorylist),
      writeInventory(finalInventorylist))
    : res.status(404).send("Incorrect Inventory ID");
});

module.exports = router;
