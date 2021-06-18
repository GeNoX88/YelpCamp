const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis, corporis! Veniam ratione dolores accusantium quae minus illo iste nesciunt tempore, vitae id autem nostrum voluptas quam praesentium neque, adipisci aliquid!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            author: '60bdfb423b395505f4308f04',
            images: [
                {
                    url: 'https://res.cloudinary.com/doy4tnavn/image/upload/v1623591426/YelpCamp/lkkqostt1tp0fdemjdl5.jpg',
                    filename: 'YelpCamp/ml1fw8tpsxbiim9bfmyy'
                },
                {
                    url: 'https://res.cloudinary.com/doy4tnavn/image/upload/v1623589592/YelpCamp/mdqjvunvw40hsyfmjn0n.jpg',
                    filename: 'YelpCamp/orpkjlty4owmkv9wkwxn'
                }
            ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});