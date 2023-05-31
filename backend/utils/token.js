import jwt from "jsonwebtoken";

export const generateToken = (args) => {
  const { user, key, time } = args;

  const accessToken = jwt.sign(
    {
      user,
    },
    key,
    { expiresIn: time }
  );

  return accessToken;
};

export const getUserData = (user) => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: user.image,
    role: user.role,
    address: user?.address,
    phone: user?.phone,
    createdAt: user.createdAt,
  };
};
