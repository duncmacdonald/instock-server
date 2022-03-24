const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4 } = require("uuid");
const email = require("email-validator");
require("dotenv").config();
const { PORT, BACKEND_URL } = process.env;
const app = express();
// Read data file
function readWarehouse() {
  const warehouseData = fs.readFileSync("./data/warehouses.json");
  const parsedData = JSON.parse(warehouseData);
  return parsedData;
}

// Write data file
function writeWarehouse(data) {
  fs.writeFileSync("./data/warehouses.json", JSON.stringify(data));
}

// Get condensed list of video information
//Added post call to create warehouse info
router
  .route("/")
  let warehouses = readWarehouse()
    .get((req, res) => {   
        console.log("warehouse posting endpoint");
        res.status(200).send(warehouses);
    })
  .post((req, res) => {
    const wareHouseInfo = readWarehouse();
    const updatedWarehouse = Object.assign({ id: v4() }, req.body);
    if (validWarehouse(updatedWarehouse)) {
      wareHouseInfo.unshift(updatedWarehouse);
      writeWarehouse(wareHouseInfo);
      res.status(200).send(wareHouseInfo[0]);
    } else {
      res
        .status(400)
        .send(
          `Please send the fields as per the current requirement-mandatory fields or format is missing/incorrect`
        );
    }
  });

  router.route("/:id").put((req, res) => {
    let warehouses = readWarehouse();
    const { id } = req.params
    const warehouseIndex = warehouses.findIndex(
      (warehouse) => warehouse.id === id);

  if (warehouseIndex === -1) {
    res.status(404).send(`Warehouse ${req.params.id} does not exist`);
    return;
  }

  if (validWarehouse(req.body)) {
    warehouses[warehouseIndex] = req.body;
    warehouses[warehouseIndex].id = req.params.id;

    writeWarehouse(warehouses);

    res.status(200).send("specific warehouse endpoint");
  } else {
    res
      .status(400)
      .send("All fields required. Server validates email and phone number");
  }
});

//Checks that all data fields exist, phonenumber length and punctuation are correct, email is valid
function validWarehouse(warehouse) {
  if (
    warehouse.id &&
    warehouse.name &&
    warehouse.address &&
    warehouse.city &&
    warehouse.country &&
    warehouse.contact.name &&
    warehouse.contact.position &&
    warehouse.contact.phone &&
    warehouse.contact.email
  ) {
    //proper phone number regex could go here if required
    if (
      !(
        warehouse.contact.phone.length === 17 &&
        warehouse.contact.phone.substring(0, 4) === "+1 (" &&
        warehouse.contact.phone.substring(7, 9) === ") " &&
        warehouse.contact.phone.charAt(12) === "-"
      )
    )
      return false;

    if (email.validate(warehouse.contact.email)) return true;
  }
  return false;
}

module.exports = router;
// 1. Take the warehouse array and find() the warehouse which has the id that is equal 
//to the params. 
//2. If the warehouse doesn't exist then send a 404 error, if it does then
// write a function that filters through itself, looks for its id/content and gets rid of it with a 200 message.   
router.route("/:id"). delete( (req, res)=> {
  const warehouseData = readWarehouse();
  const {id} = req.params
const deleted = warehouseData.find(warehouseData=> warehouseData.id === id )
//If the id being requested exists, then we want to filter the data and return everything except for that id. 
if (deleted) {
const newData = warehouseData.filter(warehouseData=>warehouseData.id !== id) 
writeWarehouse (newData)
res.status(200).json({message: 'Success, your warehouse was deleted!'})
} else {
  res.status(404).json({message: 'This ID does not exist *_*.'})
} 
});


// {
//     "id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
//     "name": "Manhattan",
//     "address": "503 Broadway",
//     "city": "New York",
//     "country": "USA",
//     "contact": {
//       "name": "Parmin Aujla",
//       "position": "Warehouse Manager",
//       "phone": "+1 (646) 123-1234",
//       "email": "paujla@instock.com"
//     }
// }
