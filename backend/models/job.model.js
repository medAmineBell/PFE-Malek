import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    website: {
      type: String,
    },
    category: {
      type: String,
    },
    salary: { type: String },
    location: { type: String },
    jobNature: { type: String },
    applicationDate: { type: String },
    description: { type: String },
    requiredKnowledge: [String],
    experience: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apply",
      },
    ],
  },
  { timestamps: true }
);

// Define a virtual property for the 'id' field
jobSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized when converting to JSON
jobSchema.set("toJSON", {
  virtuals: true,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
