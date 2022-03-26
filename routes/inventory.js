const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4 } = require("uuid");

require("dotenv").config();
const { PORT, BACKEND_URL } = process.env;

// // Read data file
function readInventory() {
  const inventoryData = fs.readFileSync("./data/inventories.json");
  const parsedData = JSON.parse(inventoryData);
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

function ValidInventoryItem(item) {
  if (
    item.id &&
    item.warehouseID &&
    item.warehouseName &&
    item.itemName &&
    item.description &&
    item.category &&
    item.status &&
    item.quantity
  ) {
    return true;
  } else {
    return false;
  }
}

function inventoryListEditor(inventoryItem) {
  const inventoryList = readInventory();

  const updatedInventoryList = inventoryList.map((inventory) => {
    return inventoryItem.id === inventory.id ? inventoryItem : inventory;
  });

  return updatedInventoryList;
}

router.route("/:id").put((req, res) => {
  const { body } = req;
  ValidInventoryItem(body)
    ? (res.status(200).send(inventoryListEditor(body)),
      writeInventory(inventoryListEditor(body)))
    : res.status(400).send("All fields required.");
});

module.exports = router;
