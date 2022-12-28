const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogSchema = new Schema({
    firstName: String,
    lastName: String,
    blogTitle: String,
    email: String,
    imageUrl: String,
    category: String,
    blog: String,
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog; 