
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid"; // For generating unique file names
import { environment } from "../loaders/environment.loader.js";

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



export const getImageFileNames = async (req, res) => {
  try {
    const bucketName = environment.AWS_BUCKET_NAME;
    const { page = 1, limit = 10, token } = req.query;

    // Helper function to fetch files from a specific folder
    const fetchFilesFromFolder = async (prefix) => {
      const params = {
        Bucket: bucketName,
        Prefix: prefix, // Specify the folder
        MaxKeys: parseInt(limit),
        ContinuationToken: token || undefined,
      };
      return await s3.listObjectsV2(params).promise();
    };

    // Fetch files from media_files/ and media_library/
    const [mediaFiles, mediaLibrary] = await Promise.all([
      fetchFilesFromFolder("media_files/"),
      fetchFilesFromFolder("media_library/"),
    ]);

    // Merge the files from both folders
    const allFiles = [
      ...mediaFiles.Contents.map((item) => item.Key),
      ...mediaLibrary.Contents.map((item) => item.Key),
    ];

    // Combine pagination tokens if needed (AWS does not merge tokens)
    const nextToken = mediaFiles.NextContinuationToken || mediaLibrary.NextContinuationToken;

    res.json({
      files: allFiles.slice(0, limit), // Return limited number of files
      nextToken: nextToken || null,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching image files:", error);
    res.status(500).json({ error: "Failed to fetch image file names" });
  }
};




// Controller to upload media files to S3
export const uploadMediaFile = async (req, res) => {
  try {
    const file = req.file; // File uploaded via multer

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate unique file name
    const fileExtension = file.originalname.split(".").pop(); // Get file extension
    const uniqueFileName = `${uuidv4()}.${fileExtension}`; // e.g., 'random-uuid.jpg'

    const params = {
      Bucket: environment.AWS_BUCKET_NAME,
      Key: `media_files/${uniqueFileName}`, // Define folder and file name
      Body: file.buffer, // File content
      ContentType: file.mimetype, // MIME type (image/jpeg, etc.)
      // ACL: "public-read", // Optional: Make file publicly accessible
    };

    const data = await s3.upload(params).promise();

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: data.Location, // URL of the uploaded file
      fileName: `media_files/${uniqueFileName}`,
    });
  } catch (error) {
    console.error("Error uploading media file:", error);
    res.status(500).json({ error: "Failed to upload media file" });
  }
};
