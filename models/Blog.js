const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    category: String,
    blog: String,
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog; 