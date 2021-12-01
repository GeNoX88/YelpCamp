import { findById, findByIdAndUpdate } from '../models/campground';
import Review, { findByIdAndDelete } from '../models/review';

export async function createReview(req, res) {
    const campground = await findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully create a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

export async function deleteReview(req, res) {
    const { id, reviewId } = req.params;
    await findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully delete review!');
    res.redirect(`/campgrounds/${id}`);
}