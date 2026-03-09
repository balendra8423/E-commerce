import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice"; // Import deleteFeatureImage
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  console.log(uploadedImageUrl, "uploadedImageUrl");

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  // New handler for deleting an image
  function handleDeleteFeatureImage(imageId) {
    dispatch(deleteFeatureImage(imageId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages()); // Refresh the list after deletion
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log(featureImageList, "featureImageList");

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      <Button onClick={handleUploadFeatureImage} className="w-full mt-5">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div
                key={featureImgItem._id}
                className="relative overflow-hidden border rounded-lg"
              >
                {" "}
                {/* Added key and styling */}
                <img
                  src={featureImgItem.image}
                  alt="Feature" // Added alt attribute for accessibility
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <div className="p-3 bg-white">
                  {" "}
                  {/* Added a div for button and padding */}
                  <Button
                    onClick={() => handleDeleteFeatureImage(featureImgItem._id)} // Pass the image ID
                    className="w-full bg-red-500 hover:bg-red-600" // Styled as red for delete
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
