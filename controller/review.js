const Campground = require("../models/campground");
const Review = require("../models/review");
module.exports.createReview = async(req, res, next) => {
    const camps = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camps.reviews.push(review);
    await review.save();
    await camps.save();
    req.flash("success", "Succesfully added review");
    res.redirect(`/campgrounds/${camps._id}`);
};
module.exports.delete = async(req, res, next) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Succesfully deleted review");
    res.redirect(`/campgrounds/${id}`);
};