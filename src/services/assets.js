const { queryWebsite } = require('../db/mysql');
const assets = {};

assets.getCarouselImages = async () =>{
    const sql = "SELECT * from gallery";
    const res = await queryWebsite(sql);
    return res;
}
assets.getProductDetails = async () =>{
    const sql = "SELECT * from products";
    const res = await queryWebsite(sql);
    return res;
}
module.exports = assets;
