const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();
const {PORT, BACKEND_URL} = process.env;


// Read data file
let warehousefunction = function readVideos() {
    const warehouseData = fs.readFileSync("./data/warehouses.json");
    const parsedData = JSON.parse(warehouseData);
    return parsedData;
   
}

let warehouseData = warehousefunction()

// Write data file
function writeVideos(data){
    fs.writeFileSync("./data/warehouses.json", JSON.stringify(data));
}


// Get condensed list of all Warehouses information
router.route("/")
    .get((req, res) => {   
        console.log("warehouse posting endpoint");
        res.status(200).send(warehouseData);
    })


// Get condensed list of single Warehouse
router.route("/:id")
    .get((req,res)=>{
        const { id } = req.params;
        const selectedWarehouse = warehouseData.find((warehouseDetail) => warehouseDetail.id === id);
        res.send(selectedWarehouse)
        
    })


module.exports = router;