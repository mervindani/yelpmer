// Lorem, ipsum dolor sit amet consectetur adipisicing elit.
// Reprehenderit dolorem atque, animi optio natus, quisquam
//  inventore consequatur doloribus sunt eveniet libero ea. Consequuntur id
//   molestiae sequi temporibus amet. Porro, odit? Lorem ipsum dolor sit, amet consectetur
//   adipisicing elit. Unde neque placeat consectetur illo impedit cupiditate dolorum
//    reprehenderit excepturi ducimus molestias voluptatem fugit magnam sit quia eaque rerum dolor,
//    corporis provident.
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapboxToken });
module.exports.index = async(req, res, next) => {
    const campgrounds = await Campground.find({}).populate("author");
    res.render("campgrounds/index", { campgrounds });
};
module.exports.addForm = (req, res) => {
    res.render("campgrounds/new");
};
module.exports.addCamp = async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("invalid camp", 400);
    const geoData = await geoCoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.author = req.user._id;
    camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    await camp.save();
    console.log(camp);
    req.flash("success", "Succesfully added campground");
    res.redirect(`/campgrounds/${camp._id}`);
};
module.exports.show = async(req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("author");

    if (!campgrounds) {
        req.flash("error", "cannot load campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campgrounds });
};
module.exports.editForm = async(req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds) {
        req.flash("error", "cannot load campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campgrounds });
};
module.exports.editCamp = async(req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
        console.log(campground);
    }
    req.flash("success", "Succesfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.delete = async(req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Succesfully deleted campground");
    res.redirect("/campgrounds");
};