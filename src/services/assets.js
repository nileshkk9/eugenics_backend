const { queryWebsite } = require('../db/mysql');
const assets = {};

assets.getCarouselImages = async () => {
  const sql = 'SELECT * from gallery';
  const res = await queryWebsite(sql);
  return res;
};
assets.getProductDetails = async () => {
  const sql = 'SELECT * from products WHERE isActive = 1';
  const res = await queryWebsite(sql);
  return res;
};

assets.getProductById = async (id) => {
  const sql = `SELECT * from products WHERE id = ${id}`;
  const res = await queryWebsite(sql);
  return res;
};

assets.getProductByParameter = async (column, value) => {
  const sql = `SELECT * from products WHERE ${column} = '${value}'`;
  const res = await queryWebsite(sql);
  return res;
};

assets.getEquipmentDetails = async () => {
  const sql = 'SELECT * from diagnostics_equipment WHERE is_active = 1';
  const res = await queryWebsite(sql);
  return res;
};

assets.getEquipmentDetailsBySlug = async (slug) => {
  const sql = `SELECT * from diagnostics_equipment WHERE slug = '${slug}'`;
  const res = await queryWebsite(sql);
  return res;
};

module.exports = assets;
