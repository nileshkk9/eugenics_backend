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
      const imageData = await assetService.getProductDetails();
      res.send(imageData);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
