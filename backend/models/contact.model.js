import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define a virtual property for the 'id' field
contactSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized when converting to JSON
contactSchema.set("toJSON", {
  virtuals: true,
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
