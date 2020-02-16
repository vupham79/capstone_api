import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, "Id is required!"],
      unique: [true, "Id already existed!"]
    },
    displayName: {
      type: String,
      required: [true, "Display name is required!"],
      min: [3, "Display name is too short!"],
      max: [40, "Display name is too long!"]
    },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          return /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.test(
            v
          );
        },
        message: props => `${props.value} is not a valid email!`
      },
      required: [true, "Email required"],
      min: [6, "Email is too short!"],
      max: [40, "Email is too long!"]
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /(09|01[2|6|8|9])+([0-9]{8})\b/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [true, "Phone number required"],
      min: [8, "Phone nunber is too short!"],
      max: [11, "Phone nunber is too long!"]
    },
    accessToken: {
      type: String,
      required: [true, "Access Token required"]
    },
    isActivated: Boolean
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);
