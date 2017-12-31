

var Product = require('../models/product');  // importing product file model by using path or directory of the file where I want to export.

var mongoose = require('mongoose'); // mongoose requirement;
mongoose.connect('localhost:27017/DB_Bazar'); // Database connection

/* creating new product using which mode I import here */
var products = [
    new Product({
        imagePath: 'http://ksassets.timeincuk.net/wp/uploads/sites/54/2017/07/apple-watch-01.jpeg',
        title: 'Apple Watch',
        description: 'Awesome Watch!!!',
        price: 45
    }),
    new Product({
        imagePath: 'http://img.runningwarehouse.com/watermark/rsg.php?path=/fp_rotating/NKEZVOM13W.jpg&nw=780',
        title: 'Zoome Vomero Shoe',
        description: 'Awesome Shoe!!!',
        price: 25
    }),
    new Product({
        imagePath: 'https://media.contentapi.ea.com/content/dam/ea/easports/fifa/buy/fifa18/june5/easbuy-share-fifa18le.jpg',
        title: 'FIFA 18',
        description: 'Awesome Game!!!',
        price: 45
    }),
    new Product({
        imagePath: 'https://cnet4.cbsistatic.com/img/knVcFvL9RVPKDKE9kJqJy5L0gQM=/830x467/2017/10/31/312b3b6e-59b7-499a-aea4-9bc5f9721a21/iphone-x-54.jpg',
        title: 'iphone X',
        description: 'Awesome Phone!!!',
        price: 1204
    }),
    new Product({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2nAiRlqIypbcrCrOMYbphaur2lGQjFZM368_fwaLI69pWzU9K',
        title: 'SUZUKI Hayate',
        description: 'Awesome Bike!!!',
        price: 1904
    })
];

/*
  Storing products into the Database.
  mongoose allows me to save a model (data) into the Database by using .save() method.
*/
var done = 0;
for(var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if(done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect(); // disconnecting the connection with Database.
}
