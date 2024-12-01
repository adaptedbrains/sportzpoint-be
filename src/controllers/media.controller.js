
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




const bucketName = environment.AWS_BUCKET_NAME;

let recentlyUploadedFiles = [];

// Helper function to fetch files from a specific folder
const fetchAllFilesFromFolder = async (prefix, limit, continuationToken) => {
  const params = {
    Bucket: bucketName,
    Prefix: prefix,
    MaxKeys: limit,
    ContinuationToken: continuationToken || undefined,
  };
  const data = await s3.listObjectsV2(params).promise();
  return data;
};


// // Controller to upload media files to S3
// export const uploadMediaFile = async (req, res) => {
//   try {
//     const file = req.file; // File uploaded via multer

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // Generate unique file name
//     const fileExtension = file.originalname.split(".").pop(); // Get file extension
//     const uniqueFileName = `${uuidv4()}.${fileExtension}`; // e.g., 'random-uuid.jpg'

//     const params = {
//       Bucket: environment.AWS_BUCKET_NAME,
//       Key: `media_files/${uniqueFileName}`, // Define folder and file name
//       Body: file.buffer, // File content
//       ContentType: file.mimetype, // MIME type (image/jpeg, etc.)
//       // ACL: "public-read", // Optional: Make file publicly accessible
//     };

//     const data = await s3.upload(params).promise();

//     res.status(200).json({
//       message: "File uploaded successfully",
//       fileUrl: data.Location, // URL of the uploaded file
//       fileName: `media_files/${uniqueFileName}`,
//     });
//   } catch (error) {
//     console.error("Error uploading media file:", error);
//     res.status(500).json({ error: "Failed to upload media file" });
//   }
// };


export const uploadMediaFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate a unique file name
    const fileExtension = file.originalname.split(".").pop();
    const uniqueFileName = `media_files/${uuidv4()}.${fileExtension}`;

    // S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload the file to S3
    const data = await s3.upload(params).promise();

    // Add the file to the cache
    recentlyUploadedFiles.unshift({
      Key: uniqueFileName,
      LastModified: new Date().toISOString(),
    });

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: data.Location,
      fileName: uniqueFileName,
    });
  } catch (error) {
    console.error("Error uploading media file:", error);
    res.status(500).json({ error: "Failed to upload media file" });
  }
};

// Get image file names from S3
export const getImageFileNames = async (req, res) => {
  try {
    const { page = 1, limit = 20, token } = req.query;

    // Fetch files from S3
    const [mediaFiles, mediaLibrary] = await Promise.all([
      fetchAllFilesFromFolder("media_files/", limit, token),
      fetchAllFilesFromFolder("media_library/", limit, token),
    ]);

    // Combine S3 results and cache
    let allFiles = [
      ...recentlyUploadedFiles,
      ...mediaFiles.Contents,
      ...mediaLibrary.Contents,
    ];

    // Sort by LastModified to show recent uploads first
    allFiles.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    );

    // Paginate results
    const startIndex = (page - 1) * limit;
    const paginatedFiles = allFiles.slice(startIndex, startIndex + limit);

    res.json({
      files: paginatedFiles.map((file) => file.Key),
      nextToken: mediaFiles.NextContinuationToken || mediaLibrary.NextContinuationToken || null,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching image files:", error);
    res.status(500).json({ error: "Failed to fetch image file names" });
  }
};