const express = require("express");
const auth = require("../middlewares/auth.middleware");
const CustomLinkController = require("../controllers/customLink.controller");
const AddCustomLink = require("../validations/customLink/customLink.validator");
const upload = require("../bucket-config/bucket");
const router = express.Router();

router.post("/add", auth, CustomLinkController.addCustomLink);
router.get("/counts", CustomLinkController.getCustomLinksCount);
router.get("/:customLinkId", CustomLinkController.viewCustomLink);
router.patch(
  "/:customLinkId",
  upload.single("image"), 
  auth,
  CustomLinkController.updateCustomLink
);
router.delete("/:customLinkId", auth, CustomLinkController.deleteCustomLink);
router.get("/", auth, CustomLinkController.getMyCustomLinks);

module.exports = router;
