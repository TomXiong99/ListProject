import express from "express";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import api from "./api/api";
import host from "./host/host";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL || "");
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () =>
  console.log(`Connected to database ${process.env.DATABASE_URL}`)
);

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: "THIS IS THE SECRET PASSWORD",
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  })
);
app.use("/api", api);
app.get("*", host);

const port = process.env.PORT || 8888;
const hostURL = process.env.HOST || "localhost";
app.listen(+port, hostURL, () =>
  console.log(`Listening on http://${hostURL}:${port}`)
);
