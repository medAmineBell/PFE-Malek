import { Schema, model } from "mongoose";

const applySchema = new Schema(
  {
    resume: {
      type: String,
      required: true,
    },
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    letter: {
      type: String,
      required: true,
    },
    diploma: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    spokenLanguage: {
      type: String,
      required: true,
    },
    formations: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "success", "rejected"],
    },
  },
  { timestamps: true }
);

// Define a virtual property for the 'id' field
applySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized when converting to JSON
applySchema.set("toJSON", {
  virtuals: true,
});

const Apply = model("Apply", applySchema);

export default Apply;
