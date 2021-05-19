const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const camps = require("../controller/campground");

const { isLoggedin, validateCampground, isAuthor } = require("../middleware");

router
    .route("/")
    .get(catchAsync(camps.index))
    .post(
        isLoggedin,
        upload.array("image"),
        validateCampground,
        catchAsync(camps.addCamp)
    );

router.get("/new", isLoggedin, camps.addForm);
router
    .route("/:id")
    .get(catchAsync(camps.show))
    .delete(isLoggedin, isAuthor, catchAsync(camps.delete))
    .put(
        isLoggedin,
        isAuthor,
        upload.array("image"),
        validateCampground,
        catchAsync(camps.editCamp)
    );
router.get("/:id/edit", isLoggedin, isAuthor, catchAsync(camps.editForm));

module.exports = router;