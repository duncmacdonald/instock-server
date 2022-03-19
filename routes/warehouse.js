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
    .post((req, res) => {
        const warehouseDetail = req.body;
        warehouseData.push({ ...warehouseDetail, id: uuidv4()}) 
        res.send('post route reached');
    });


// Get condensed list of single Warehouse
router.route("/:id")
    .get((req,res)=>{
        const { id } = req.params;
        const selectedWarehouse = warehouseData.find((warehouseDetail) => warehouseDetail.id === id);
        res.send(selectedWarehouse)
        
    })

// below code works to delete and edit. 
    
    // .delete((req, res)=> {
    //     const { id } = req.params
    //     warehouseData = warehouseData.filter((warehouseDetail)=> warehouseDetail.id !== id)
    // })
    
    // .patch((req, res) => {
    //     const { id } = req.params;
    //     const { name, city, country, address  } = req.body
    //     const warehouseDetail = warehouseData.find((warehouseDetail)=> warehouseDetail.id === id )
    
    //     if (name) {
    //         warehouseDetail.name = name
    //     }
    //     if (city) {
    //         warehouseDetail.city = city
    //     }
    //     if (country) {
    //         warehouseDetail.country = country
    //     }
    //     if (address) {
    //         warehouseDetail.address = address
    //     }
    // })   

module.exports = router;