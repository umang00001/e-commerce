const express = require("express");
const dotEnv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute")
const cors = require("cors")
const path = require("path")
//config
dotEnv.config({ path: "./config/config.env" });

//database config
connectDb();

//rest object
const app = express();
//middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"))
app.use(express.static(path.join(__dirname, './client/build')));
// app.use(morgan('dev'))

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute)


app.use("*", function (req, resp) {
  resp.sendFile(path.join(__dirname, './client/build/index.html'))
})
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
