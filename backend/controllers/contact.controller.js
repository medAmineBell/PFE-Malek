import asyncHandler from "express-async-handler";
import Contact from "../models/contact.model.js";
import CustomError from "../lib/custom-error.js";

export const createContact = asyncHandler(async (req, res) => {
  const { username, email, message } = req.body;

  const alreadySend = await Contact.findOne({ email });

  if (alreadySend) throw new CustomError(400, "you already send message!");

  const contact = new Contact({ username, email, message });

  if (!contact) throw new CustomError(400, "something went wrong");

  const newContact = await contact.save();
  res.status(201).json(newContact);
});

export const getContactsList = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const pageSize = 9;

  const [contacts, contactCount] = await Promise.all([
    Contact.find({})
      .skip(pageSize * (page - 1))
      .limit(pageSize),
    Contact.countDocuments({}),
  ]);

  if (!contacts) throw new CustomError(404, "contacts not found!");

  res.status(200).json({
    contacts,
    page: parseInt(page) || 1,
    contactCount,
    pages: Math.ceil(contactCount / pageSize),
  });
});

export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) throw new CustomError(404, "contacts not found!");

  res.status(200).json(contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id).lean().exec();

  if (!contact) throw new CustomError(404, "Contact not found!");

  const deletedContact = await Contact.deleteOne({ _id: contact._id }).exec();

  if (deletedContact.deletedCount === 0)
    throw new CustomError(500, "Something went wrong!");

  res.status(200).json({ message: "Contact has been deleted" });
});
