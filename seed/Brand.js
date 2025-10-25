const Brand = require("../models/Brand");

const brands = [
  { _id: "65a7e20102e12c44f59943da", name: "Apple" },
  { _id: "65a7e20102e12c44f59943db", name: "Samsung" },
  { _id: "65a7e20102e12c44f59943dc", name: "OPPO" },
  { _id: "65a7e20102e12c44f59943dd", name: "Huawei" },
  { _id: "65a7e20102e12c44f59943de", name: "Microsoft Surface" },
  { _id: "65a7e20102e12c44f59943df", name: "Infinix" },
  { _id: "65a7e20102e12c44f59943e0", name: "HP Pavilion" },
  // Các thương hiệu đồng hồ thông minh (Naviforce, SKMEI)
  { _id: "65a7e20102e12c44f599440b", name: "Naviforce" },
  { _id: "65a7e20102e12c44f599440c", name: "SKMEI 9117" },
  // Thương hiệu liên quan đến chiếu sáng/phụ kiện điện tử
  { _id: "65a7e20102e12c44f59943f2", name: "LED Lights" },
  { _id: "65a7e20102e12c44f599441b", name: "Car Aux" },
  { _id: "65a7e20102e12c44f599441c", name: "W1209 DC12V" },
  { _id: "65a7e20102e12c44f599441e", name: "Neon LED Light" },
];

exports.seedBrand = async () => {
  try {
    await Brand.insertMany(brands);
    console.log('Brand seeded successfully');
  } catch (error) {
    console.log(error);
  }
};
