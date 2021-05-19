const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const { isLoggedin, validateReview, isReviewAuthor } = require("../middleware");
const reviews = require("../controller/review");
router.post("/", isLoggedin, validateReview, catchAsync(reviews.createReview));
router.delete(
    "/:reviewId",
    isLoggedin,
    isReviewAuthor,
    catchAsync(reviews.delete)
);

module.exports = router;