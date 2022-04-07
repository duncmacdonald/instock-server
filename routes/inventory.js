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

// // Get list of all the inventories
router
  .route("/")
  .get((req, res) => {
    const inventoryData = readInventory();
    console.log("inventory posting endpoint");
    res.status(200).send(inventoryData);
  })
  .post((req, res) => {
    if (ValidInventoryItem(req.body)) {
      let list = readInventory();
      list.unshift(req.body);

      writeInventory(list);

      res.status(200).send(list[0]);
    }
  });

// // Get a single inventory detail
router.route("/:id").get((req, res) => {
  let inventoryData = readInventory();
  const { id } = req.params;
  const selectedInventory = inventoryData.find(
    (inventoryDetail) => inventoryDetail.id === id
  );

  res.status(200).send(selectedInventory);
});

// // Get a list of all the inventories by given warehouse

router.route("/warehousedetail/:warehouseID").get((req, res) => {
  let inventoryWarehouseId = readInventory();
  const { warehouseID } = req.params;
  const selectedWarehouseid = inventoryWarehouseId.filter((inventoryDetail) => {
    return inventoryDetail.warehouseID === warehouseID;
  });

  res.send(selectedWarehouseid);
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
