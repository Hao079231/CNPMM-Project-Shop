const Review = require("../models/Review");

const reviews = [
  {
    _id: "65c252e3dcd9253acfbaa76c",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f599444e",
    rating: 5,
    comment:
      "Vượt ngoài mong đợi! Chiếc điện thoại này thực sự thay đổi cuộc chơi. Tốc độ cực nhanh, camera chụp ảnh tuyệt đẹp, pin dùng lâu kinh ngạc. Đây là chiếc điện thoại tốt nhất từ trước đến nay!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25339dcd9253acfbaa79e",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994451",
    rating: 3,
    comment:
      "Thiết kế Art thực sự **độc đáo và nổi bật**, camera **XMAGE** chụp ảnh rất ấn tượng. Tuy nhiên, việc sử dụng **HarmonyOS** và **thiếu các dịch vụ của Google** khiến trải nghiệm hàng ngày hơi bất tiện. Hiệu năng ổn, nhưng mức giá này có thể chọn được máy tiện dụng hơn.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c2535fdcd9253acfbaa7c9",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994450",
    rating: 2,
    comment:
      "Thời lượng pin quá kém. Dù camera và màn hình rất tốt, nhưng pin tụt nhanh chóng mặt, đặc biệt là khi chụp ảnh hoặc quay video. Phải sạc nhiều lần hơn so với quảng cáo, rất bất tiện cho một chiếc flagship.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25380dcd9253acfbaa7df",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994452",
    rating: 5,
    comment:
      "Hoàn hảo cho người thích thiết kế nhỏ gọn! Dù giữ nguyên kiểu dáng cổ điển, nhưng **sức mạnh bên trong lại đáng kinh ngạc**. Máy xử lý đa nhiệm cực kỳ mượt mà, không hề thua kém các dòng cao cấp. Rất hài lòng với hiệu năng và mức giá này!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c253ebdcd9253acfbaa7f5",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994453",
    rating: 5,
    comment:
      "Hoàn hảo trong tầm giá! **Màn hình Super AMOLED 120Hz** xem phim và lướt web cực kỳ đã mắt, màu sắc rực rỡ và mượt mà. Hiệu năng ổn định cho các tác vụ hàng ngày và chơi game nhẹ. **Pin dùng rất tốt**, đủ dùng thoải mái cả ngày. Rất hài lòng với chiếc điện thoại tầm trung này!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25416dcd9253acfbaa80b",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994454",
    rating: 3,
    comment:
      "Gần như hoàn hảo, nhưng... **Thiết kế mỏng nhẹ** và tính năng **sạc nhanh SuperVOOC** là điểm cộng lớn, sạc rất nhanh. Tuy nhiên, khả năng **chụp chân dung** không thực sự ấn tượng như quảng cáo, đôi lúc ảnh bị xử lý hơi quá đà. Một chiếc điện thoại ổn, nhưng cần cải thiện về thuật toán camera.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c2542cdcd9253acfbaa821",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994455",
    rating: 5,
    comment:
      "Hoàn hảo cho những người mê chụp ảnh selfie! **Thiết kế da thời thượng** làm máy sang trọng hẳn, cầm rất chắc tay. **Camera selfie kép** cho chất lượng ảnh cực kỳ ấn tượng, góc rộng hữu ích và chi tiết rất nét. Dù có một vài điểm cần làm quen với **HarmonyOS**, nhưng nhìn chung đây là một chiếc điện thoại đẹp và mạnh mẽ.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25443dcd9253acfbaa837",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994456",
    rating: 5,
    comment:
      "Ước mơ của nhà sáng tạo nội dung! Màn hình **ProMotion 120Hz** đúng là một kiệt tác. Hình ảnh mượt mà, màu sắc sống động, và độ chính xác màu tuyệt vời. Hoàn hảo cho việc chỉnh sửa ảnh, thiết kế đồ họa, và xem video. Mua bản **refurbished** này với giá tốt mà chất lượng không khác gì máy mới!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25473dcd9253acfbaa84d",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994457",
    rating: 3,
    comment:
      "Hoạt động ổn định nhưng chưa thực sự xứng đáng với mức giá cao. Trải nghiệm **màn hình lớn như máy tính bảng** rất tuyệt vời cho đa nhiệm và xem phim. Tuy nhiên, vết gập vẫn còn khá rõ, và pin chưa được cải thiện nhiều so với đời trước. Thiết kế máy gập vẫn còn **quá dày** khi gập lại, cần tinh tế hơn cho một sản phẩm cao cấp.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c254a8dcd9253acfbaa863",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f599444f",
    rating: 5,
    comment:
      "Hoàn toàn xuất sắc! Đây là đỉnh cao của Android. **Bút S Pen** quá tiện lợi cho công việc và ghi chú, camera với khả năng **zoom quang 10x** chụp xa sắc nét đến khó tin. Hiệu năng vượt trội, thiết kế khung Titanium sang trọng, xứng đáng là **siêu phẩm**.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c254d1dcd9253acfbaa891",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994458",
    rating: 5,
    comment:
      "Rất xứng đáng với giá tiền! **Pin 5000mAh** đúng là 'trâu bò', dùng thoải mái cả ngày dài mà không cần lo sạc. **Camera siêu sắc nét** cho ra ảnh chi tiết, không ngờ một chiếc máy tầm trung lại có chất lượng chụp tốt đến vậy. Thiết kế đẹp và hiệu năng ổn định, hoàn toàn hài lòng!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c254f2dcd9253acfbaa89e",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994459",
    rating: 3,
    comment:
      "Giá quá đắt so với trải nghiệm tổng thể. Thiết kế **siêu nhẹ** và khả năng **chống nước IPX8** là đột phá, thực sự ấn tượng. Tuy nhiên, với mức giá **45 triệu** này, việc phải dùng **HarmonyOS** và không có các ứng dụng Google chính thức là một nhược điểm lớn. Chỉ nên mua nếu bạn chấp nhận được sự bất tiện về phần mềm.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c2551bdcd9253acfbaa8ab",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f599445a",
    rating: 5,
    comment:
      "Tuyệt vời và cuốn hút! Đây là chiếc iPhone có **thời lượng pin xuất sắc** nhất tôi từng dùng, có thể dùng đến cuối ngày mà không cần lo lắng. **Màn hình lớn** xem phim và chơi game cực kỳ đã. Hiệu năng ổn định, hoàn hảo cho những ai cần một chiếc điện thoại pin bền bỉ và màn hình rộng.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25533dcd9253acfbaa8b8",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f599445b",
    rating: 2,
    comment:
      "Rất thất vọng về thời lượng pin. Thiết kế **gập vỏ sò thời trang** và **màn hình phụ lớn** rất tiện lợi, nhưng máy dùng **quá hao pin**. Với mức giá này, tôi mong đợi một chiếc điện thoại bền bỉ hơn chứ không phải phải sạc hai lần một ngày. Đẹp nhưng không thực dụng.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25550dcd9253acfbaa8c5",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f599445c",
    rating: 5,
    comment:
      "Hiệu năng tuyệt vời! Với **chip Snapdragon**, chiếc điện thoại này xử lý game và ứng dụng nặng một cách **mạnh mẽ và mượt mà**, không hề thua kém các dòng cao cấp hơn. Thiết kế đẹp và sạc siêu nhanh cũng là điểm cộng lớn. Hoàn hảo cho những người dùng cần hiệu suất cao với mức giá phải chăng.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c255abdcd9253acfbaa908",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f599445f",
    rating: 5,
    comment:
      "Kiệt tác cho dân sáng tạo! Chiếc máy này thực sự là một **máy trạm di động** hoàn hảo. **Màn hình cảm ứng xoay lật sáng tạo** là điểm ăn tiền nhất, chuyển đổi linh hoạt giữa laptop và canvas vẽ. Xử lý các tác vụ đồ họa và render nặng cực kỳ mượt mà. Tuyệt vời cho những người cần cả hiệu năng và tính linh hoạt.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c255cadcd9253acfbaa916",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994461",
    rating: 2,
    comment:
      "Nóng quá và không đáng tiền! Thiết kế **siêu mỏng, siêu nhẹ** thì đúng là đỉnh cao, nhưng khi chạy các tác vụ nặng hoặc đa nhiệm nhiều, máy **rất dễ bị nóng** và hiệu năng bị giảm rõ rệt. Không có quạt tản nhiệt là một điểm trừ lớn. Tôi mua máy vì **hiệu năng tuyệt vời** nhưng lại bị giới hạn do vấn đề tản nhiệt. Thật thất vọng!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c255e9dcd9253acfbaa924",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f5994460",
    rating: 3,
    comment:
      "Thiết kế sang trọng, nhưng hiệu năng chưa rõ ràng. **Thiết kế kim loại nguyên khối** và **màn hình FullView** cực kỳ đẹp mắt, cảm giác cao cấp. Tuy nhiên, hiệu suất xử lý các tác vụ chuyên môn chưa thực sự nổi trội so với mức giá. Máy hoạt động ổn định cho văn phòng, nhưng cần thêm thời gian để đánh giá khả năng xử lý đồ họa nặng.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c255fcdcd9253acfbaa932",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f599445e",
    rating: 3,
    comment:
      "Cần kiểm tra kỹ trước khi mua! Chiếc laptop này có **màn hình Dynamic AMOLED 2X** tuyệt đẹp, màu sắc rực rỡ và **thiết kế mỏng nhẹ** rất sang trọng. Tuy nhiên, hiệu năng thực tế và khả năng tản nhiệt khi chạy các phần mềm đồ họa nặng chưa thực sự ổn định so với mức giá **49 triệu**. Người dùng nên cân nhắc kỹ về nhu cầu sử dụng chuyên sâu trước khi quyết định.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25676dcd9253acfbaa940",
    user: "65c2526fdcd9253acfbaa731",
    product: "65a7e45902e12c44f599445d",
    rating: 5,
    comment:
      "Tạm biệt những giới hạn! Chiếc **MacBook Pro** này là một sự thay đổi cuộc chơi thực sự. **Chip M3 Max** mang lại **hiệu năng không đối thủ**, render video 4K hay xử lý đồ họa 3D giờ đây trở nên cực kỳ nhanh chóng. Màn hình Liquid Retina XDR và thời lượng pin vẫn là tuyệt vời. Đây là công cụ không thể thiếu cho các **chuyên gia sáng tạo**.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25703dcd9253acfbaa970",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f599444e",
    rating: 5,
    comment:
      "Dịch vụ khách hàng tuyệt vời! Quá trình mua chiếc **iPhone 15 Pro Max** diễn ra nhanh chóng và chuyên nghiệp. Đội ngũ hỗ trợ nhiệt tình và giải quyết nhanh vấn đề nhỏ về giao hàng. Cảm thấy yên tâm khi mua sản phẩm giá trị cao tại đây!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25735dcd9253acfbaa988",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994450",
    rating: 3,
    comment:
      "Tốc độ cập nhật phần mềm rất chậm. Chiếc điện thoại này có **camera và màn hình tuyệt vời**, nhưng tốc độ ra các bản cập nhật phần mềm (ColorOS) lại rất chậm chạp. Hy vọng **OPPO** sẽ cải thiện vấn đề này để đảm bảo trải nghiệm người dùng và các tính năng mới được cập nhật kịp thời.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25758dcd9253acfbaa9a0",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994451",
    rating: 5,
    comment:
      "Vua Camera! Ảnh và video chụp từ **camera XMAGE** quá đỗi tuyệt vời, ngay cả với người không chuyên. Chế độ **chân dung** đặc biệt ấn tượng, làm nổi bật chủ thể một cách chuyên nghiệp. Thiết kế **Art độc đáo** cũng là một điểm cộng lớn khiến tôi vô cùng hài lòng!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25787dcd9253acfbaa9b8",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994452",
    rating: 2,
    comment:
      "Thất vọng về thiết kế và màn hình! Dù có **sức mạnh mới** (chip mới) nhưng máy vẫn giữ **thiết kế cổ điển** với viền màn hình quá dày và màn hình quá nhỏ so với năm 2024. Trải nghiệm xem phim và lướt web bị hạn chế. Đáng lẽ Apple nên nâng cấp màn hình và bỏ đi nút Home vật lý. Rất khó chịu khi sử dụng hàng ngày!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c257c1dcd9253acfbaa9d0",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994453",
    rating: 3,
    comment:
      "Giá trị tốt, nhưng hiệu năng chỉ ở mức ổn. **Màn hình Super AMOLED 120Hz** đúng là điểm cộng lớn, rất đẹp và mượt. Tuy nhiên, **chip Exynos** khi chơi game nặng hoặc chạy đa nhiệm thường bị ấm và có độ trễ nhẹ. Đáng tiền nếu chỉ dùng cho nhu cầu cơ bản, nhưng hiệu năng chưa phải là **tầm trung đáng tiền** nhất.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25805dcd9253acfbaa9e8",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994454",
    rating: 2,
    comment:
      "Vấn đề quá nhiệt nghiêm trọng! Máy có **thiết kế mỏng nhẹ** và **sạc SuperVOOC** rất nhanh, nhưng lại rất dễ bị nóng lên, đặc biệt là khi chơi game hoặc sử dụng camera liên tục (tác vụ nặng). Cầm máy rất khó chịu trong thời gian dài. Rất thất vọng về khả năng tản nhiệt của chiếc điện thoại này.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c2583adcd9253acfbaaa06",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994455",
    rating: 2,
    comment:
      "Thiếu các ứng dụng quen thuộc! Mặc dù **camera selfie kép** và **thiết kế da** rất ấn tượng, nhưng việc phải dùng **HarmonyOS** và **thiếu dịch vụ Google** đã gây ra nhiều bất tiện. Việc cài đặt các ứng dụng cơ bản như YouTube hay Google Maps rất phức tạp. Trải nghiệm phần mềm chưa đủ tốt với mức giá cao này.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25950dcd9253acfbaaa88",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994456",
    rating: 3,
    comment:
      "Giá tốt cho hiệu năng, nhưng cần kiểm tra kỹ. **Chip A15** và **màn hình ProMotion 120Hz** vẫn quá mạnh mẽ, xử lý mọi game nặng mượt mà. Tuy nhiên, vì là bản **Refurbished**, ngoại hình máy có một vài vết xước nhỏ và **dung lượng pin tối đa không đạt 100%** như máy mới. Cần lưu ý kiểm tra dung lượng pin khi nhận hàng.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c2596edcd9253acfbaaaa0",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994457",
    rating: 3,
    comment:
      "Màn hình tuyệt đẹp, nhưng... **Màn hình lớn như máy tính bảng** quá **tuyệt vời** cho trải nghiệm xem và làm việc. Tuy nhiên, chất lượng hiển thị cao cấp này phải trả giá bằng **thời lượng pin kém**. Người dùng nặng đô như tôi phải sạc thường xuyên. Khả năng gập chưa thực sự tối ưu hóa cho pin.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c259a0dcd9253acfbaaab8",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f599444f",
    rating: 2,
    comment:
      "Lỗi camera rất khó chịu! Dù máy có **khả năng zoom quang 10x** đáng kinh ngạc và **bút S Pen** tiện lợi, nhưng máy bị lỗi phần mềm camera khiến ảnh chụp ban đêm bị nhòe hoặc mất chi tiết. Đã cập nhật nhiều lần nhưng vẫn không được khắc phục. Rất thất vọng với chất lượng ảnh chụp của một **siêu phẩm** giá cao như thế này.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c259b0dcd9253acfbaaad0",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994458",
    rating: 2,
    comment:
      "Không đúng như quảng cáo. **Camera siêu sắc nét** được quảng cáo nhưng chất lượng ảnh thực tế lại chỉ ở mức trung bình, đặc biệt là khi chụp thiếu sáng. **Mô tả online** và các đánh giá đã vẽ ra một bức tranh khác. Máy có **pin 5000mAh bền bỉ** nhưng chất lượng hình ảnh không đạt kỳ vọng của tôi.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c259cadcd9253acfbaaae8",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994459",
    rating: 5,
    comment:
      "Yêu thích sự bền bỉ! Chiếc điện thoại gập này thực sự là một đột phá về độ bền và thiết kế. Máy **siêu nhẹ** và **chống nước IPX8** khiến tôi hoàn toàn yên tâm khi sử dụng hàng ngày. **Pin dùng rất lâu**, không cần phải sạc liên tục như các máy gập khác. Tuyệt vời cho công việc và giải trí!",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c259e4dcd9253acfbaab00",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f599445b",
    rating: 5,
    comment:
      "Độc đáo và cuốn hút! Chiếc **Z Flip 5** này không giống bất kỳ điện thoại nào khác. Thiết kế **gập vỏ sò thời trang** giúp tôi nổi bật. **Màn hình phụ lớn** quá tiện lợi để xem thông báo và chụp ảnh selfie mà không cần mở máy. Hoàn hảo cho những người muốn một chiếc điện thoại vừa mạnh mẽ vừa thể hiện cá tính riêng.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c259fadcd9253acfbaab18",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f599445c",
    rating: 1,
    comment:
      "Lỗi nghiêm trọng và rất khó chịu! Dù máy có **chip Snapdragon** mạnh mẽ nhưng lại bị lỗi màn hình (chảy mực/sọc) sau một thời gian ngắn sử dụng. Chất lượng hoàn thiện kém, cảm giác máy không bền như quảng cáo. Hiệu năng tốt nhưng không bù đắp được lỗi phần cứng nghiêm trọng này.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25af9dcd9253acfbaab43",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f599445d",
    rating: 1,
    comment:
      "Giá quá chát cho những gì nhận được! Mặc dù có **Hiệu năng không đối thủ** nhờ **chip M3 Max**, nhưng máy bị lỗi phần mềm (bug) liên tục khi sử dụng các ứng dụng chuyên nghiệp của bên thứ ba. **Mức giá 72 triệu VNĐ** mà vẫn gặp lỗi vặt. Sản phẩm thiếu sự ổn định cần có của một máy trạm chuyên nghiệp. Cực kỳ thất vọng với trải nghiệm phần mềm.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25b50dcd9253acfbaab77",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994463",
    rating: 3,
    comment:
      "Hiệu năng ổn, nhưng thiết kế chưa nổi bật. Máy có **card đồ họa NVIDIA** giúp chơi các game tầm trung khá mượt mà, đúng như kỳ vọng. Tuy nhiên, thiết kế bên ngoài lại khá **cồng kềnh và thô** so với các dòng gaming khác, và **màn hình có màu sắc chưa được đẹp** như mong đợi. Là lựa chọn tốt cho gaming với **ngân sách hạn chế**, nhưng không phải là thiết kế đẹp nhất.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
  {
    _id: "65c25b9bdcd9253acfbaab8d",
    user: "65b8e564ea5ce114184ccb96",
    product: "65a7e45902e12c44f5994469",
    rating: 3,
    comment:
      "Không sáng như mong đợi. Chiếc đèn **Wall sticker 3D** này nhìn rất nghệ thuật và độc đáo khi tắt. Tuy nhiên, ánh sáng đèn lại **quá yếu** (dùng pin cúc áo), không đủ để làm đèn ngủ hay tạo điểm nhấn rõ rệt. Đèn chỉ dùng để trang trí nhẹ, không thực dụng như một chiếc đèn thông thường.",
    createdAt: "2024-02-07T10:25:58.424Z",
  },
];

exports.seedReview = async () => {
  try {
    await Review.insertMany(reviews);
    console.log("Review seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
