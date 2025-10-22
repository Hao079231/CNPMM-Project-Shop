const cron = require("node-cron");
const Order = require("../models/Order");

cron.schedule("* * * * *", async () => {
  console.log("[CRON] Đang kiểm tra đơn hàng chờ xác nhận...");

  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  try {
    const orders = await Order.find({
      status: 'Pending',
      confirmedAt: null,
      cancellationRequested: { $ne: true },
      createdAt: { $lte: thirtyMinutesAgo }
    });

    if (orders.length === 0) {
      console.log("Không có đơn hàng nào cần confirm trong thời gian này.\n");
      return;
    }

    for (const order of orders) {
      order.status = 'Confirmed';
      order.confirmedAt = new Date();
      await order.save();
      console.log(`Auto-confirmed order: ${order._id}`);
    }

    console.log(`Tổng số đơn đã auto-confirm: ${orders.length}\n`);
  } catch (err) {
    console.error("Auto confirm failed:", err);
  }
});
