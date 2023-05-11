import express from "express";
import userModel from "../models/users";

const usersRouter = express.Router();

//Get all
usersRouter.get("/", async (request, response) => {
  try {
    const users = await userModel.find();
    response.json(users);
  } catch (err: any) {
    response.status(500).json({ message: err.message });
  }
});

//Get one
usersRouter.get("/:id", async (request, response) => {
  try {
    const user = await userModel.findOne({ username: request.params.id });
    if (user !== null)
      response.json({ user: user.username, lists: user.lists });
    else response.status(404).json({ message: "Cannot find user" });
  } catch (err: any) {
    response.status(500).json({ message: err.message });
  }
});

//Create a new user
//Called when registering a new account
usersRouter.post("/", async (request, response) => {
  try {
    if (
      (await userModel.findOne({ username: request.body.username })) !== null
    ) {
      response
        .status(400)
        .json({ userCreated: false, message: "Username already taken" });
      return;
    }
    //Uncomment this code if you want to set requirements on passwords
    // if (request.body.password === "") {
    //   response
    //     .status(400)
    //     .json({ userCreated: false, message: "Password cannot be empty" });
    // }
    const user = new userModel({
      username: request.body.username,
      password: request.body.password,
      lists: [],
    });
    const newUser = await user.save();
    request.session.user = newUser.username; //add the username to the session
    request.session.cookie.expires = new Date(Date.now() + 2.419e9); //update the session expiration date to 4 weeks from now
    request.session.save();
    response.status(201).json({ userCreated: true, user: newUser.username });
  } catch (err: any) {
    response.status(500).json({ userCreated: false, message: err.message });
  }
});

///////////////////////////// Work in progress
//Update one
usersRouter.put("/:id", async (request, response) => {
  try {
    const user = await userModel.findById(request.params.id);
    try {
      if (request.body.username) user!.username = request.body.username;
      if (request.body.password) user!.password = request.body.password;
      const updatedUser = await user!.save();
      response.status(200).json(updatedUser);
    } catch (err: any) {
      response.status(400).json({ message: err.message });
    }
  } catch (err: any) {
    response.status(500).json({ message: err.message });
  }
});
///////////////////

///////////////////////////// Work in progress
//Delete one
usersRouter.delete("/", async (request, response) => {
  try {
    userModel.findOneAndDelete({ username: request.session.user });
    response.status(200).json({ message: "Successfully deleted" });
  } catch (err: any) {
    response.status(500).json({ message: err });
  }
});

export default usersRouter;
