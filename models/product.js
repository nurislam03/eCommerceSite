var mongoose = require('mongoose'); // importing mongoose
var Schema = mongoose.Schema; // creating Schema object

/*
Defining the Schema more specifically here I will define what
type of data I am going to store in the Database.

*/
var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
});

module.exports = mongoose.model('Product', schema);  //exporting the schema to model so that i can work with this.
