const Wishlist = require("../models/Wishlist");

const wishlistItem = [
  {
    _id: "65c2441232078478e340ab60",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f599444e",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Không thể ngừng nghĩ về chiếc điện thoại này! Tất cả các tính năng mới như **chip A17 Bionic** và **camera 48MP** đang khiến tôi sợ bị bỏ lỡ (major FOMO). Tiền lương kỳ tới, coi như đã có chủ! ✨",
  },
  {
    _id: "65c2441332078478e340ab64",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f599444f",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Thiết bị tối thượng của tôi đã có bản nâng cấp! Chiếc **siêu phẩm S24 Ultra** này với **bút S Pen** và **khả năng zoom quang 10x** là sự bổ sung hoàn hảo cho bộ sưu tập công nghệ của tôi. Đến kỳ lương sau, tôi sẽ sở hữu nó!",
  },
  {
    _id: "65c2441532078478e340ab68",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994450",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Nói lời tạm biệt với những bức ảnh mờ! Chiếc điện thoại này chính là 'trợ thủ' du lịch mới của tôi để chụp những bức ảnh tuyệt đẹp. **Camera** với **chip MariSilicon X** chắc chắn sẽ nâng tầm khả năng sáng tạo hình ảnh của tôi. 📸",
  },
  {
    _id: "65c2441732078478e340ab6c",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994456",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Quái vật gaming đã được mở khóa! Chiếc **iPhone 13 Pro Refurbished** này với **chip A15 mạnh mẽ** và **màn hình ProMotion 120Hz** sẽ là cỗ máy chơi game tối thượng với mức giá quá hời. Đã đến lúc chinh phục thế giới ảo rồi! ⚔️",
  },
  {
    _id: "65c2441a32078478e340ab70",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994452",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Phải mua chiếc **iPhone SE (2024)** này làm quà sinh nhật cho bạn. **Hiệu năng mạnh mẽ** và **giá phải chăng** rất phù hợp. Một món quà công nghệ chất lượng, đầy đủ **sức mạnh mới** trong thiết kế quen thuộc! 🎁",
  },
  {
    _id: "65c2442132078478e340ab7a",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994463",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Sẵn sàng chiến game! Chiếc **HP Pavilion Gaming 15** này sẽ biến phòng tôi thành thiên đường giải trí hoàn hảo. **Card đồ họa NVIDIA** và **mức giá tầm trung** lý tưởng để 'cày' game mới! Tạm biệt tình trạng lag giật! ⚔️",
  },
  {
    _id: "65c2443632078478e340ab9a",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994474",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Món quà Giáng sinh hoàn hảo cho bản thân! Thiết kế mạnh mẽ với tính năng **Chronograph** rất nam tính và cuốn hút. Nhất định phải mua!",
  },
  {
    _id: "65c2444732078478e340aba4",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994472",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Món quà hoàn hảo cho người thân yêu! Chiếc **vòng đeo tay thông minh Galaxy Fit3** này sẽ giúp họ theo dõi **hoạt động** và **nhịp tim** hàng ngày. Món quà ý nghĩa để khuyến khích lối sống khỏe mạnh! 💪",
  },
  {
    _id: "65c2445332078478e340abab",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994467",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Thiết bị hoàn hảo cho tối thứ Bảy! Chiếc **Laptop xoay gập 360 độ** này sẽ là sự kết hợp hoàn hảo giữa công việc và giải trí. **Tính linh hoạt** của nó giúp tôi vừa làm việc nhẹ nhàng, vừa xem phim thoải mái vào cuối tuần. Phải mua ngay!",
  },
  {
    _id: "65c2447032078478e340abd4",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994468",
    createdAt: "2024-02-07T10:11:46.794Z",
    updatedAt: "2024-02-07T10:11:46.794Z",
    note: "Phải mua chiếc **HP Envy x360 13** này cho chuyến du lịch sắp tới! **Màn hình OLED sắc nét** và **thiết kế 2 trong 1** (laptop/tablet) cực kỳ tiện lợi để xem phim hay chỉnh sửa ảnh nhanh ngay cả khi đang ở bãi biển. Thiết kế **cao cấp** rất phù hợp để mang theo bên mình. 🏖️",
  },
];

exports.seedWishlist = async () => {
  try {
    await Wishlist.insertMany(wishlistItem);
    console.log("Wishlist seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
