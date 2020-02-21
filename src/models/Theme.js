import mongoose, { Schema } from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
      required: [true, "Id is required!"]
    },
    name: {
      type: String,
      default: "",
      required: [true, "Theme name is required!"]
    },
    mainFont: {
      type: String,
      default: "",
      required: [true, "Main font is required!"]
    },
    mainColor: {
      type: String,
      default: "",
      required: [true, "Main color is required!"]
    },
    categories: [
      {
        id: {
          type: String,
          default: "",
          required: [true, "Category id are required!"]
        },
        name: {
          type: String,
          default: "",
          required: [true, "Category name are required!"]
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Theme", ThemeSchema);
