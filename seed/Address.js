const Address = require("../models/Address");

const addresses = [
  {
    _id: "65c26398e1e1a2106ac8fbd5",
    user: "65b8e564ea5ce114184ccb96",
    street: "111 Lê Lợi, quận 11",
    city: "Hồ Chí Minh",
    state: "Hồ Chí Minh",
    phoneNumber: "0989372832",
    postalCode: "201012",
    country: "Việt Nam",
    type: "Home",
    __v: 0,
  },
  {
    _id: "65c26412e1e1a2106ac8fbd8",
    user: "65b8e564ea5ce114184ccb96",
    street: "125 Tăng Nhơn Phú B, quận Thủ Đức",
    city: "Hồ Chí Minh",
    state: "Hồ Chí Minh",
    phoneNumber: "0998327473",
    postalCode: "301273",
    country: "Việt Nam",
    type: "Buisness",
    __v: 0,
  },
];

exports.seedAddress = async () => {
  try {
    await Address.insertMany(addresses);
    console.log("Address seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
