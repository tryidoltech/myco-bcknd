const mongoose = require("mongoose");
const crypto = require("crypto");
const { Readable } = require("stream");
const { ObjectId } = require("mongodb");
const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");

let gfsBucket; 
 mongoose.connect(process.env.MONGODB_URL);
console.log("Connected to database");

const conn = mongoose.connection;

conn.once("open", () => {
    gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "Images",
    });
});


exports.uploadImg = async (imageFiles) => {
    const uploadedImages = [];


    if (!gfsBucket) {
        console.log("Error: GridFSBucket is not initialized");
        return uploadedImages;
    }

    try {
        if (Array.isArray(imageFiles)) {
            for (const imageFile of imageFiles) {
                const uploadedImageInfo = await uploadImage(imageFile);
                uploadedImages.push(uploadedImageInfo);
            }
        } else {
            const uploadedImageInfo = await uploadImage(imageFiles);
            uploadedImages.push(uploadedImageInfo);
        }
    } catch (error) {

    }

    return uploadedImages;
};

async function uploadImage(imageFile) {
    const imageRandomName = crypto.randomBytes(20).toString("hex");
    const imageStream = Readable.from(imageFile.data);

    try {
        // Check if gfsBucket is initialized
        if (!gfsBucket) {
            throw new Error("GridFSBucket is not initialized");
        }

        const imageUploadStream = gfsBucket.openUploadStream(imageRandomName);
        const uploadedImageInfo = {
            filename: imageRandomName,
            mimetype: imageFile.mimetype,
            id: imageUploadStream.id,
        };

        await new Promise((resolve, reject) => {
            imageStream.pipe(imageUploadStream)
                .on('error', reject)
                .on('finish', () => {
                    resolve();
                });
        });

        return uploadedImageInfo;
    } catch (error) {
        console.log("Error uploading image:", error);
        throw error;
    }
}

exports.deleteImg = async (imageId) => {
    try {
        const img = await gfsBucket
            .find({ _id: new ObjectId(imageId) })
            .toArray();

        if (img.length === 0) {
            return false;
        }

        await gfsBucket.delete(new ObjectId(imageId));
        return true;
    } catch (error) {
        console.error("Error deleting image:", error);
        // Error during deletion
        return false;
    }
}
exports.printImg =   CatchAsyncErrors(async (req, res, next) => {
    try {
      const img = await gfsBucket.find({ filename: req.params.name }).toArray();
      if (img.length === 0) {
        return res.status(404).json({
          error: "Image not found",
        });
      }

      const format = req.params.type + "/" + req.params.format;
      const stream = await gfsBucket.openDownloadStreamByName(req.params.name);

      res.set("Content-Type", format);
      res.status(200);
      stream.pipe(res);
    } catch (error) {
      console.error(error);

      // Handle specific errors or return a generic error message
      if (error.name === "CastError") {
        return res.status(400).json({
          error: "Invalid image ID",
        });
      }

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  })