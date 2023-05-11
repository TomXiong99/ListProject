import express from "express";
import usersRouter from "./routes/users";
import loginRouter from "./routes/login";
import listRouter from "./routes/list";

const api = express.Router();

api.use("/users", usersRouter);
api.use("/login", loginRouter);
api.use("/list", listRouter);

export default api;
