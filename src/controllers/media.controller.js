import AWS from "aws-sdk";
import { environment } from "../loaders/environment.loader.js";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: environment.AWS_ACCESS_KEY, // Store credentials securely
  secretAccessKey: environment.AWS_SECRET_KEY,
  region: environment.AWS_REGION,
});

// Controller to fetch media file names from S3
export const getMediaFileNames = async (req, res) => {
  try {
    const bucketName = environment.AWS_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
    };

    const data = await s3.listObjectsV2(params).promise();

    // Extract file names (keys) from S3 response
    const fileNames = data.Contents.map((item) => item.Key);

    res.json(fileNames); // Send file names as response
  } catch (error) {
    console.error("Error fetching media names:", error);
    res.status(500).json({ error: "Failed to fetch media file names" });
  }
};
