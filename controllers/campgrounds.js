import { cloudinary } from '../cloudinary';
import Campground, { find, findById, findByIdAndUpdate } from '../models/campground';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

export async function index(req, res) {
    const campgrounds = await find({});
    res.render('campgrounds/index', { campgrounds });
}

export function renderNewForm(req, res) {
    return res.render('campgrounds/new');
}

export async function createCampground(req, res) {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

export async function showCampground(req, res) {
    const campground = await findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

export async function renderEditForm(req, res) {
    const { id } = req.params;
    const campground = await findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect(`/campgrounds/`);
    }
    res.render('campgrounds/edit', { campground });
}

export async function updateCampground(req, res) {
    const { id } = req.params;
    const campground = await findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    if (req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        campground.images.push(...imgs);
    }
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }, { new: true });
    }
    console.log(campground);
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// module.exports.deleteCampground = async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     for (let image of campground.images) {
//         await cloudinary.uploader.destroy(image.filename);
//     }
//     req.flash('success', 'Successfully deleted campground');
//     res.redirect('/campgrounds');
// };

export async function deleteCampground(req, res) {
    const { id } = req.params;
    let campground = await findById(id);
    try {
            for (let image of campground.images) {
                    await cloudinary.uploader.destroy(image.filename);
            }
    } catch(err) {
            req.flash('error', 'Campground images could not be deleted, something went wrong.');
            return res.redirect(`/campgrounds/${id}`);
    }
    await campground.remove();
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}