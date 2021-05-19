const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");
const ImageSchema = new Schema({
    url: String,
    filename: String,
});
ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_160");
});
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
        title: String,
        price: Number,
        images: [ImageSchema],
        description: String,
        location: String,
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: "Review",
        }, ],
    },
    opts
);
CampgroundSchema.virtual("properties.popup").get(function() {
    return `<bold><a href="/campgrounds/${this._id}">${this.title}</a></bold>
            <p>${this.description.substring(0, 20)}...</p>`;
});
CampgroundSchema.post("findOneAndDelete", async function(data) {
    if (data) {
        await Review.deleteMany({ _id: { $in: data.reviews } });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);