const express = require("express");
const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");

//Before using any services enable CORS
app.use(cors());
app.options("*", cors()); // * means allow all the http request to pass from any other region

// setting the path for config.env file
dotenv.config({
  path: "./config/config.env",
});

//Constants and routes
const api = process.env.API_URL;
const productRouter = require("./route/product");
const categoryRouter = require("./route/category");
const userRouter = require("./route/user");
const authJWT = require('./helper/jwt');
//connect to mongodb server
//connectDB();

//Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({urlencoded:true}))


//Routers
app.use(`${api}/user`, userRouter);
//app.use(authJWT); // to protect api routes
app.use(`${api}/products`, productRouter);
app.use(`${api}/category`, categoryRouter);


// Display message in home page
app.get("/", (req, res) => {
  res.send("Hello from express");
});

//Database connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    dbName: "Eshop",
  })
  .then(() => {
    console.log("Database connected to local server");
  })
  .catch((err) => {
    console.log("Error connecting database");
  });

//Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
