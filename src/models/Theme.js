import mongoose, { Schema } from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    mainFont: {
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
