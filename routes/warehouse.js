const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const email = require("email-validator");
require('dotenv').config();
const {PORT, BACKEND_URL} = process.env;


 


// Read data file
function readWarehouse() {
    const warehouseData = fs.readFileSync("./data/warehouses.json");
    const parsedData = JSON.parse(warehouseData);
    return parsedData;
}

// Write data file
function writeWarehouse(data){
    fs.writeFileSync("./data/warehouses.json", JSON.stringify(data));
}


// Get condensed list of video information
router.route("/")
    .get((req, res) => {   
        console.log("warehouse posting endpoint");
        res.status(200).send("warehouse posting endpoint");
    })
    .post((req, res) => {
        console.log("warehouse posting endpoint");
        res.status(200).send("warehouse posting endpoint");;
    });

router.route("/:id")
    .put((req, res) => {
        let warehouses = readWarehouse();
        const warehouseIndex = warehouses.findIndex(warehouse => warehouse.id === req.params.id)

        if (warehouseIndex === -1){
            res.status(404).send(`Warehouse ${req.params.id} does not exist`)
            return;
        }

        if(validWarehouse(req.body)){
            warehouses[warehouseIndex] = req.body;
            warehouses[warehouseIndex].id = req.params.id;
            
            writeWarehouse(warehouses);

            res.status(200).send("specific warehouse endpoint");
        } else {
            res.status(400).send("All fields required. Server validates email and phone number");
        }


    });

//Checks that all data fields exist, phonenumber length and punctuation are correct, email is valid
function validWarehouse(warehouse){
    if(warehouse.id && warehouse.name && warehouse.address && warehouse.city && warehouse.country && warehouse.contact.name && warehouse.contact.position && warehouse.contact.phone && warehouse.contact.email) {
        
        //proper phone number regex could go here if required
        if(!(warehouse.contact.phone.length === 17 && warehouse.contact.phone.substring(0,4) === "+1 (" && warehouse.contact.phone.substring(7,9) === ") " && warehouse.contact.phone.charAt(12) === "-")) return false;

        if(email.validate(warehouse.contact.email)) return true;
    } 
    return false;
}

module.exports = router;

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