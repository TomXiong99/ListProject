import mongoose from "mongoose";

interface userList {
  id: string;
  title: string;
}

interface userData {
  username: string;
  password: string;
  lists: userList[];
}

const userSchema = new mongoose.Schema<userData>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lists: {
    type: [{ id: String, title: String }],
    required: true,
    _id: false,
  },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
