const Category = require("../models/Category");

const categories = [
  { _id: "65a7e24602e12c44f599442c", name: "Điện thoại" },
  { _id: "65a7e24602e12c44f599442d", name: "Máy tính xách tay" },
  { _id: "65a7e24602e12c44f5994438", name: "Đồng hồ" },
  { _id: "65a7e24602e12c44f599443f", name: "Thiết bị chiếu sáng" },
];

exports.seedCategory = async () => {
  try {
    await Category.insertMany(categories);
    console.log("Category seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
