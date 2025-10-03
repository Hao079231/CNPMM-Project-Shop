const User = require("../models/User");

const users = [
  {
    _id: "65b8e564ea5ce114184ccb96",
    name: "namnguyen",
    email: "namnguyen@gmail.com",
    password: '$2a$10$GH8p5cAsGFEdYsLaSfTQ3e1eUs7KbLmVBltjbX4DDCj2eyO2KW/Ze',
    isVerified: true,
    isAdmin: false,
    __v: 0,
  },
  {
    _id: "65c2526fdcd9253acfbaa731",
    name: "thanhminh",
    email: "minhtran@gmail.com",
    password: '$2a$10$tosjkprqtomSah0VJNyKi.TIv1JU65pl1i1IJ6wUttjYw.ENF99jG',
    isVerified: true,
    isAdmin: false,
    __v: 0,
  },
  {
    _id: "68df3fbb743fb976b9b29bfb",
    name: "admin",
    email: "admin@gmail.com",
    password: '$2a$10$1kcyDeYcLSwVYaEKtfMFkuOhPZS/jfxOOJKT28YGH4PiKRQEv6QHq',
    isVerified: true,
    isAdmin: true,
    __v: 0,
  },
];

exports.seedUser = async () => {
  try {
    await User.insertMany(users);
    console.log("User seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
