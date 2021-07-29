//todo: change storage to multerS3 and change filepath in product-router to 'location'
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3();
aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: "us-east-2",
});

const storage = multerS3({
  acl: "public-read",
  s3,
  bucket: "usman-first-node-app",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: Date.now() + file.originalname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString() + file.originalname);
  },
});
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

const upload = multer({
  storage: storage,
  // fileFilter(req, file, cb) {
  //   if (!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)) {
  //     return cb(new Error("Kindly upload an image"));
  //   }
  //   cb(undefined, true);

  //   // cb(new Error("File Upload failed!!"));
  //   // cb(undefined, true); //no error & upload should be accepted
  //   // cb(undefined, false); //no error & upload should be silently rejected
  // },
});

module.exports = upload;
