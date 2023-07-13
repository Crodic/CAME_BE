// Import
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

// Import file
const Connection = require("./app/Config/db/DBContext");
const collectionRouter = require("./app/Routes/v2/v2_collectionRouter");
const userRouter = require("./app/Routes/v2/v2_userRouter");
const categoryRouter = require("./app/Routes/v2/v2_categoryRouter");
const imageRouter = require("./app/Routes/v2/v2_imageRouter");
const vipRouter = require("./app/Routes/v2/v2_vipRouter");

// Config app
const app = express();
const port = process.env.PORT;


// Config Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(cors());

// Connection MongoDB
Connection();

// Routes

app.use("/v2/api/user", userRouter);
app.use("/v2/api/category", categoryRouter);
app.use("/v2/api/image", imageRouter);
app.use("/v2/api/collection", collectionRouter);
app.use("/v2/api/vip", vipRouter);


// App Start
app.listen(port, () => {
    console.log("Server is running");
})