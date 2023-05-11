import express from "express";
import userModel from "../models/users";

declare module "express-session" {
  interface SessionData {
    user: string;
  }
}

const loginRouter = express.Router();

//Login, on home page load
loginRouter.get("/", async (request, response) => {
  try {
    const user = await userModel.findOne({ username: request.session.user });
    if (user !== null) {
      //if session exists with a logged in user and user exists
      request.session.cookie.expires = new Date(Date.now() + 2.419e9); //update the session expiration date to 4 weeks from now
      request.session.save();
      response.json({ loggedIn: true, user: request.session.user });
    } else {
      // if the session doesn't exist or the logged in user no longer exists
      request.session.destroy((err: any) => {
        //destroy the session
        if (err) response.json({ loggedIn: false, message: err });
        else
          response.json({
            loggedIn: false,
            message: "You have been logged out of your previous session",
          });
      });
    }
  } catch (err: any) {
    response.status(500).json({ message: err.message });
  }
});

//Login, upon login through login page
loginRouter.post("/", async (request, response) => {
  try {
    const user = await userModel.findOne({ username: request.body.username });
    if (user !== null) {
      if (request.body.password === user.password) {
        //if user exists and login credentials are correct
        request.session.user = user.username; //add username to the session
        request.session.cookie.expires = new Date(Date.now() + 2.419e9); //update the session expiration date to 4 weeks from now
        request.session.save();
        response.json({ loggedIn: true, user: request.session.user });
      } else
        response
          .status(401)
          .json({ loggedIn: false, message: "Incorrect login credentials" });
    } else {
      response.status(404).json({ loggedIn: false, message: "User not found" });
    }
  } catch (err: any) {
    response.status(500).json({ message: err.message });
  }
});

//Log out
loginRouter.delete("/", async (request, response) => {
  if (!request.session.user) {
    response.json({ message: "No user signed in" });
    return;
  }

  request.session.destroy((err: any) => {
    if (err) response.json({ message: err });
    else response.json({ message: "Successfully logged out" });
  });
});

export default loginRouter;
