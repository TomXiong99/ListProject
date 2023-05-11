import express, { response } from "express";
import listModel from "../models/list";
import userModel from "../models/users";

declare module "express-session" {
  interface SessionData {
    user: string;
  }
}

const listRouter = express.Router();

//Get one list
listRouter.get("/:id", async (request, response) => {
  try {
    const list = await listModel.findById(request.params.id); //find the list by id
    if (list == null) {
      //check to see if the list exists
      response.status(404).json({ exists: false });
      return;
    }
    response.status(200).json({
      //if list exists return contents
      exists: true,
      contents: list.contents,
      title: list.title,
      owned: request.session.user === list.owner, //own looks at the currently logged in user and see if they own the list
    });
  } catch (err: any) {
    response.status(500).json({ exists: false, message: err.message });
  }
});

//create a new list
listRouter.post("/", async (request, response) => {
  try {
    const list = new listModel({
      owner: request.session.user,
      title: request.body.title || "New List", //if copying a list check to see if title
      contents: request.body.contents || [], // and contents exists and save
    });
    const newList = await list.save();
    const user = await userModel.findOneAndUpdate(
      //update the user
      { username: request.session.user },
      { $push: { lists: { id: newList.id, title: newList.title } } }, //add this list to their lists
      { runValidators: true }
    );
    await user?.save();
    response.status(201).json({ created: true, list: newList });
  } catch (err: any) {
    response.status(500).json({ created: false, message: err.message });
  }
});

//updating a list
listRouter.put("/:id", async (request, response) => {
  try {
    const list = await listModel.findById(request.params.id);
    try {
      if (request.body.contents) list!.contents = request.body.contents;
      if (request.body.title) list!.title = request.body.title;
      const updatedList = await list!.save();
      const user = await userModel.findOne({ username: updatedList.owner });
      user?.lists.forEach((element) => {
        if (element.id === updatedList.id) {
          element.title = updatedList.title;
        }
      });
      user?.save();
      response.status(200).json({ updated: true, list: updatedList });
    } catch (err: any) {
      response.status(400).json({ updated: false, message: err.message });
    }
  } catch (err: any) {
    response.status(500).json({ updated: false, message: err.message });
  }
});

//delete list
//need to delete list from user lists
listRouter.delete("/:id", async (request, response) => {
  try {
    userModel
      .findOneAndUpdate(
        { username: request.session.user },
        { $pull: { lists: { id: request.params.id } } }
      )
      .exec();
    listModel.findByIdAndDelete(request.params.id).exec();
    response
      .status(200)
      .json({ deleted: true, message: "Successfully deleted" });
  } catch (err: any) {
    response.status(500).json({ deleted: false, message: err.message });
  }
});

export default listRouter;
