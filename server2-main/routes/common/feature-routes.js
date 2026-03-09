const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage, // <-- Import the new controller function
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

// NEW: Add the DELETE route for feature images
// The :id part makes 'id' a dynamic parameter that can be accessed via req.params.id
router.delete("/delete/:id", deleteFeatureImage);

module.exports = router;
