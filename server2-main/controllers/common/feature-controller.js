const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    console.log(image, "image");

    const featureImages = new Feature({
      image,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// NEW: Add the deleteFeatureImage controller function
const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter

    // Find the image by ID and delete it from the database
    const deletedImage = await Feature.findByIdAndDelete(id);

    // Check if the image was found and deleted
    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Feature image not found",
      });
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Feature image deleted successfully",
      data: deletedImage, // Optionally send back the deleted item's data
    });
  } catch (e) {
    console.error("Error deleting feature image:", e); // Use console.error for errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message, // Send back the error message for debugging
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage }; // Export the new function
