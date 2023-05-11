import mongoose from "mongoose";

interface content {
  checked: boolean;
  content: string;
}

interface listData {
  owner: string;
  title: string;
  contents: content[];
}

const listSchema = new mongoose.Schema<listData>({
  owner: {
    type: String,
    required: true,
    unique: false,
  },
  title: {
    type: String,
    required: true,
  },
  contents: {
    type: [{ checked: Boolean, content: String }],
    required: true,
    _id: false,
  },
});

const listModel = mongoose.model("lists", listSchema);

export default listModel;
