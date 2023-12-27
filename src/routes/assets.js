const express = require('express');
const assetService = require('../services/assets');
const router = express.Router();

router.get('/assets/carouselAssets', async (req, res, next) => {
  try {
    const imageData = await assetService.getCarouselImages();
    res.send(imageData);
  } catch (error) {
    next(error);
  }
});

router.get('/assets/productDetails', async (req, res, next) => {
  try {
    const data = await assetService.getProductDetails();
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.get('/product/:id', async (req, res, next) => {
  try {
    const data = await assetService.getProductById(req.params.id);
    res.send(data);
  } catch (error) {
    next(error);
  }
});
router.get(
  '/product/getProductByParam/:column/:value',
  async (req, res, next) => {
    try {
      const data = await assetService.getProductByParameter(
        req.params.column,
        req.params.value
      );
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
