import mongoose from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      unique: [true, "Id already existed!"]
    },
    name: {
      type: String,
      default: ""
    },
    fontTitle: {
      type: String,
      default: ""
    },
    fontBody: {
      type: String,
      default: ""
    },
    mainColor: {
      type: String,
      default: ""
    },
    categories: [
      {
        id: {
          type: String,
          default: ""
        },
        name: {
          type: String,
          default: ""
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Theme", ThemeSchema);
