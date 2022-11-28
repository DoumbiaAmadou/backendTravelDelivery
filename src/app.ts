const express = require("express");
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { Error } from "mongoose";
var bodyParser = require("body-parser");
require("dotenv/config");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");

require("dotenv/config");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(morgan("dev"));

// corps issues
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});
let connectResponse: boolean = false;

// const router = require('./routes/posts');
const userRoutes = require("./routes/user");
const productsRoutes = require("./routes/products");
const tripsRoutes = require("./routes/trips");
const reservation = require("./routes/reservation");
const ordersRoutes = require("./routes/orders");

console.log(" process.env.DB_CONNEXION ===>" + process.env.DB_CONNEXION);
console.log("Mongoose Acces");
const connectDB: () => void = async () => {
  // db connect
  try {
    connectResponse = mongoose
      .connect(
        "mongodb+srv://" +
          process.env.DB_CONNEXION +
          "@spyro.jxmxs.gcp.mongodb.net/delivery?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
        }
      )
      .then((result: any) => {
        console.log("connection Success!");
        if (result) connectResponse = true;
      })
      .catch((e: Error) => {
        console.log("connect : " + e.message);
      });
  } catch (err) {
    console.log("ERROR : " + JSON.stringify(err));
  }
};
// Debugage
console.log("process.env.PORT ==>" + process.env.PORT + "\n");
console.log("process.env.DB_CONNEXION ==>" + process.env.DB_CONNEXION);

connectDB();

interface customErrorHandler extends ErrorRequestHandler {
  status: number;
  message: string;
}
//routes
console.log("APPLY ROUTE");
// app.use('/posts', router);
app.use("/user", userRoutes);
app.use("/product", productsRoutes);
app.use("/reservation", reservation);
app.use("/trip", tripsRoutes);
app.use("/order", ordersRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/", (req: Request, res: Response) => {
  console.log("DONE redirection ==>  /trip ");
  res.redirect("/trip");
  // res.status(404).json({
  //   error: {
  //     message: " SERVER is RUNNING ",
  //   },
  // });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found sdcssscsdc");
  req.statusCode = 404;
  next(req);
});

app.listen(process.env.PORT || 3000);
