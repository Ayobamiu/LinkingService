const express = require("express");
const auth = require("../middlewares/auth.middleware");
const VisitorsViewController = require("../controllers/visitorsViews.controller");

const router = express.Router();

router.get("/:slug", VisitorsViewController.viewUserProduct);
