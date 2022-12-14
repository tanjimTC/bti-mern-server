const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Blog = require("./models/Blog");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());

const uri = process.env.DB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/binary/user/signup", async (req, res) => {
  const userExist = await User.findOne({
    email: req.body.email,
  });

  if (userExist) {
    return res.status(200).json({
      message: "User already exists with this email",
      success: false,
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
  });

  const responseFromDB = await user.save();

  let token = jwt.sign(
    {
      id: responseFromDB._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 24 }
  );

  res.status(200).json({
    message: "User created successfully",
    success: true,
    data: {
      firstName: responseFromDB.firstName,
      lastName: responseFromDB.lastName,
      email: responseFromDB.email,
      token,
    },
  });
});

app.post("/binary/blog/create", async (req, res) => {
  console.log("req receved ", req.body);
  const blog = new Blog({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    blogTitle: req.body.blogTitle,
    imageUrl: req.body.imageUrl,
    email: req.body.email,
    category: req.body.category,
    blog: req.body.blog,
  });

  const responseFromDB = await blog.save();

  res.status(200).json({
    message: "Blog created successfully",
    success: true,
    responseFromDB,
  });
});

app.get("/binary/blog/get", async (req, res) => {
  const blogs = await Blog.find();

  res.status(200).json({
    message: "Blogs fetched successfully",
    success: true,
    blogs,
  });
});

app.get("/binary/blog/get/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);

  res.status(200).json({
    message: "Blog fetched successfully",
    success: true,
    blog,
  });
});

app.post("/binary/user/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user === null || user === undefined || user?.length == 0) {
    return res.json({
      status: 404,
      success: false,
      message: "User not found with this specefic email.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({
      status: 404,
      success: false,
      message: "Email or password does not match!",
    });
  }

  let token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 24 }
  );

  res.status(200).json({
    message: "User logged in successfully",
    success: true,
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    },
  });
});

app.delete("/binary/:id", async (req, res) => {
  // habi jabi
  const id = req.params.id;
  console.log(id);
});

app.listen(3500, () => {
  console.log("Server is running on port http://localhost:3500");
});
