import mongoose from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: [true, "Id already existed!"]
    },
    name: {
      type: String,
      default: null
    },
    fontTitle: {
      type: String,
      default: null
    },
    fontBody: {
      type: String,
      default: null
    },
    mainColor: {
      type: String,
      default: null
    },
    categories: [
      {
        id: {
          type: String,
          default: null
        },
        name: {
          type: String,
          default: null
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Theme", ThemeSchema);
